import nodemailer from 'nodemailer';
import config from '../../configs/config';

// transporterAdd commentMore actions

const transporter = nodemailer.createTransport({
    // @ts-ignore
    name: config.MAIL_NAME,
    host: config.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASSWORD
    }
});

export default transporter;

