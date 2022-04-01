import emailjs from "@emailjs/browser";

emailjs.init(process.env.REACT_APP_USER_ID);
const templateIds = {
  login: "template_xjbzkrd",
  request_approved: "template_dafzsvy",
};
const sendMail = async (data, id) => {
  const template_params = {
    from_name: "aquilaafuadajo@gmail.com",
    ...data,
  };

  const response = await emailjs.send(
    process.env.REACT_APP_SERVICE_ID,
    templateIds[id],
    template_params
  );

  return response;
};

export default sendMail;
