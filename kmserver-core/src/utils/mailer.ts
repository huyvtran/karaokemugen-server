import nodemailer, { Transporter } from 'nodemailer';
import { getConfig } from '../lib/utils/config';
import logger from '../lib/utils/logger';
import { MailOptions } from 'nodemailer/lib/smtp-transport';
import sentry from './sentry';

let transporter: Transporter;
let mailOptions: MailOptions;

export function initMailer() {
	const conf = getConfig().Mail;
	transporter = nodemailer.createTransport({
		host: conf.Host,
		port: conf.Port,
		secure: conf.Secure,
		auth: {
			user: conf.User,
			pass: conf.Password,
		}
	});

	mailOptions = {
		from: `"${conf.From}" <${conf.FromMail}>`,
	};

}

export function sendMail(subject: string, message: string, to: string, toMail: string) {
	if (transporter) transporter.sendMail({...mailOptions,
		subject: subject,
		text: message,
		to: `"${to}" <${toMail}>`
	}, (error, info) => {
		if (error) {
			logger.debug('Error sending mail', {service: 'Mailer', obj: error});
			sentry.error(error);
			throw error;
		} else {
			logger.debug('Sent mail', {service: 'Mailer', obj: info});
		}
	});
}

