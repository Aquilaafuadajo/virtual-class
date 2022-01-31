import emailjs from "@emailjs/browser";

emailjs.init(process.env.REACT_APP_USER_ID);
const templateIds = {
  login: "template_xjbzkrd",
  request_approved: "template_dafzsvy",
};
const sendMail = async ({ to, message }, id) => {
  const template_params = {
    from_name: "aquilaafuadajo@gmail.com",
    to_name: to,
    message,
  };

  const response = await emailjs.send(
    process.env.REACT_APP_SERVICE_ID,
    process.env.REACT_APP_TEMPLATE_ID,
    templateIds[id]
  );

  return response;
};

export default sendMail;
