import React, { useState, forwardRef } from "react";
import { connect } from "react-redux";
import { Popover } from "react-tiny-popover";

import { uploadLecture, setWaving } from "../../../service/firebase";

// components
import ControlButton from "./ControlButton";
import UploadModal from "./UploadModal";

// icons
import { ReactComponent as MicIcon } from "../../../assets/icons/mic.svg";
import { ReactComponent as MicStrikeIcon } from "../../../assets/icons/mic_strike.svg";
import { ReactComponent as VideoIcon } from "../../../assets/icons/video.svg";
import { ReactComponent as VideoStrikeIcon } from "../../../assets/icons/video_strike.svg";
import { ReactComponent as RecordIcon } from "../../../assets/icons/record.svg";
import { ReactComponent as ShareScreenIcon } from "../../../assets/icons/share_screen.svg";
import { ReactComponent as HangupIcon } from "../../../assets/icons/hang_up.svg";

// import '../index.css'

const Footer = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [fileName, setFileName] = useState("");
  const [videoBlob, setVideoBlob] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);
  let recordedBlob;

  const startRecording = () => {
    recordedBlob = [];
    let options = { mimeType: "video/webm;codecs=vp9" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + " is not Supported");
      options = { mimeType: "video/webm;codecs=vp8" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + " is not Supported");
        options = { mimeType: "video/webm" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + " is not Supported");
          options = { mimeType: "" };
        }
      }
    }

    const mr = new MediaRecorder(props.stream, options);
    mr.onstop = handleRecordStop;
    mr.ondataavailable = handleRecordDataAvailable;
    mr.start(10); // collect 10ms of data
    setMediaRecorder(mr);
    setIsRecording(true);
  };

  const handleRecordDataAvailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedBlob.push(e.data);
    }
  };
  const handleRecordStop = (e) => {
    setUploadStatus(null);
    const blob = new Blob(recordedBlob, { type: "video/webm" });
    setVideoBlob(blob);
    setDownloadLink(window.URL.createObjectURL(blob));
    setFileName(
      `${props.classroom.department}-${props.classroom.level}-${props.classroom.title}.webm`
    );
    setIsModalOpen(true);
  };
  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };
  const onUpload = async () => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = downloadLink;
    a.className = "download-link";
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadLink);
    }, 100);
    // upload to firebase
    setIsUploading(true);
    const { teacherName, ...others } = props.classroom;
    await uploadLecture(
      { file: videoBlob, fileName, ...others },
      () => {
        setUploadStatus("success");
        setIsUploading(false);
        alert("Lecture Uploaded Successfully");
        setTimeout(function () {
          setIsModalOpen(false);
        }, 2000);
      },
      (error) => {
        alert(error);
        setUploadStatus("fail");
        alert("Failed to upload lecture, please try again");
        setIsUploading(false);
      }
    );
    // console.log("uploading...");
  };
  const onCancelUpload = () => {
    if (uploadStatus !== "success") {
      const response = window.confirm(
        "Are you sure you want to cancel? Your recorded lecture will be lost"
      );
      if (response) {
        setVideoBlob(null);
        const elements = document.body.getElementsByClassName(".download-link");
        if (elements.length > 0) {
          setTimeout(function () {
            elements[0].parentNode.removeChild(elements[0]);
            window.URL.revokeObjectURL(downloadLink);
          }, 100);
        }
        setIsUploading(false);
        setDownloadLink(null);
        setIsModalOpen(false);
        // delete lecture if it exists in db
        return;
      }
    }
    return;
  };
  const onHangUp = () => {
    if (props.isTeacher) {
      const response = window.confirm(
        "Lecture room will be deleted and all participants will be dismissed, click OK to confirm"
      );
      if (response) {
        // end lecture
      }
      return;
    }
    // leave room
  };
  const handleWaving = () => {
    setWaving(Object.values(props.user)[0].userName, props.match.params.id);
  };
  const micClick = () => {
    props.onMicClick(!Object.values(props.user)[0].audio);
  };

  const onVideoClick = () => {
    props.onVideoClick(!Object.values(props.user)[0].video);
  };

  const onScreenClick = () => {
    props.onScreenClick(!Object.values(props.user)[0].screen);
  };

  const PopoverButton = ({ className, options, isActive, buttonIcon }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
      <Popover
        isOpen={isPopoverOpen}
        positions={["top", "bottom", "left", "right"]}
        onClickOutside={() => setIsPopoverOpen(false)}
        content={
          <div className="bg-[#EDF2F7] rounded-lg ">
            {options.map(({ label, action, icon, textColor, borderB }) => (
              <p
                key={label}
                className={`p-3 border-[#BDBDBD] flex items-center justify-between cursor-pointer ${
                  borderB && "border-b"
                } ${textColor || "text-[#2F80ED]"}`}
                onClick={() => {
                  action();
                  setIsPopoverOpen(!isPopoverOpen);
                }}
              >
                {label}
              </p>
            ))}
          </div>
        }
      >
        <ControlButton
          className={className}
          activeClass={isActive ? "active" : ""}
          icon={buttonIcon}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        />
      </Popover>
    );
  };

  return (
    <div className="bg-white w-full flex justify-center items-center p-3">
      {props.isTeacher ? (
        <div className="flex">
          <PopoverButton
            options={
              isRecording
                ? [
                    {
                      label: "Stop Recording",
                      action: () => stopRecording(),
                      textColor: "delete",
                    },
                  ]
                : [
                    {
                      label: "Start Recording",
                      action: () => startRecording(),
                    },
                  ]
            }
            isActive={isRecording}
            buttonIcon={<RecordIcon />}
          />

          <ControlButton
            icon={
              props.user && Object.values(props.user)[0].audio ? (
                <MicIcon />
              ) : (
                <MicStrikeIcon />
              )
            }
            onClick={micClick}
            activeClass={
              props.user && Object.values(props.user)[0].audio ? "" : "active"
            }
            disabled={false}
          />
          <ControlButton
            icon={
              props.user && Object.values(props.user)[0].video ? (
                <VideoIcon />
              ) : (
                <VideoStrikeIcon />
              )
            }
            onClick={onVideoClick}
            activeClass={
              props.user && Object.values(props.user)[0].video ? "" : "active"
            }
            disabled={props.user && Object.values(props.user)[0].screen}
          />
          <ControlButton
            icon={<ShareScreenIcon />}
            onClick={onScreenClick}
            activeClass={
              props.user && Object.values(props.user)[0].screen ? "" : "active"
            }
          />
          <PopoverButton
            options={[
              {
                label: "End Lecture",
                action: () => onHangUp(),
                textColor: "delete",
              },
            ]}
            className="bg-[#EB5757] px-3 rounded-3xl mx-3"
            buttonIcon={<HangupIcon />}
          />
          {isModalOpen && (
            <UploadModal
              isLoading={isUploading}
              onUpload={onUpload}
              onCancel={onCancelUpload}
              fileName={fileName}
              status={uploadStatus}
            />
          )}
        </div>
      ) : (
        <div className="flex">
          <ControlButton
            icon={
              props.user && Object.values(props.user)[0].audio ? (
                <MicIcon />
              ) : (
                <MicStrikeIcon />
              )
            }
            activeClass={
              props.user && Object.values(props.user)[0].screen ? "" : "active"
            }
            disabled={true}
          />
          <PopoverButton
            options={[
              {
                label: "Leave Class",
                action: () => onHangUp(),
                textColor: "delete",
              },
            ]}
            className="bg-[#EB5757] px-3 rounded-3xl mx-3"
            buttonIcon={<HangupIcon />}
          />
          <button onClick={handleWaving} className="ml-2 text-4xl ">
            👋🏼
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    participants: state.participants,
    user: state.currentUser,
    stream: state.mainStream,
    classroom: state.classroomInfo,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setMainStream: (stream) => dispatch(setMainStream(stream)),
//     addParticipant: (user) => dispatch(addParticipant(user)),
//     setUser: (user) => dispatch(setUser(user)),
//     removeParticipant: (userId) => dispatch(removeParticipant(userId)),
//     updateParticipant: (user) => dispatch(updateParticipant(user)),
//     setClassroomInfo: (info) => dispatch(setClassroomInfo(info)),
//   };
// };

export default connect(mapStateToProps)(Footer);
