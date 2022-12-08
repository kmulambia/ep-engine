
import amqp, {Connection} from 'amqplib/callback_api';
import moment from 'moment';
import {EmailModel} from '../helpers/confirmation-email-model';
import * as SERVICE from '../services.config.json';
import logger from './logger.service';

var MailerConfig = SERVICE.MAILER;

const useMailerService = () => {
  logger.log({
    level: 'info',
    type: 'service_info',
    message: {
      error: false,
      service_name: MailerConfig.NAME,
      description: 'Connecting to RabbitMQ ',
      metadata: ' ',
      time: moment().format('DD/MM/YYYY hh:mm:ss')
    },
  });

  let ch: any
  amqp.connect(MailerConfig.URL, (errorConnect: Error, connection: Connection) => {
    if (errorConnect) {

      logger.log({
        level: 'info',
        type: 'service_info',
        message: {
          error: true,
          service_name: MailerConfig.NAME,
          description: errorConnect.message,
          metadata: ' ',
          time: moment().format('DD/MM/YYYY hh:mm:ss')
        },
      });

      return;
    }

    connection.createChannel((errorChannel: any, channel: any) => {
      if (errorChannel) {

        console.log('Error creating the channel: ', errorChannel.message);

        logger.log({
          level: 'info',
          type: 'service_info',
          message: {
            error: true,
            service_name: MailerConfig.NAME,
            description: errorChannel.message,
            metadata: ' ',
            time: moment().format('DD/MM/YYYY hh:mm:ss')
          },
        });

        return
      }

      channel.assertQueue(MailerConfig.QUEUE, {
        durable: true
      });
      channel.prefetch(1);

      ch = channel

      logger.log({
        level: 'info',
        type: 'service_info',
        message: {
          error: false,
          service_name: MailerConfig.NAME,
          description: "Connected to RabbitMQ",
          metadata: ' ',
          time: moment().format('DD/MM/YYYY hh:mm:ss')
        },
      });

    })
  })
  return (msg: EmailModel) => {

    logger.log({
      level: 'info',
      type: 'service_info',
      message: {
        error: false,
        service_name: MailerConfig.NAME,
        description: "Produce message to RabbitMQ",
        metadata: ' ',
        time: moment().format('DD/MM/YYYY hh:mm:ss')
      },
    });

    ch.sendToQueue(MailerConfig.QUEUE, Buffer.from(JSON.stringify(msg)), {
      persistent: true
    })
  }
}

Object.freeze(useMailerService);
export default useMailerService 
