const readline = require('readline');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create a new client instance
const whatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox'],
    },
  });

whatsapp.on('qr', (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

whatsapp.on('ready', () => {
  console.log('Client is ready!');
});

whatsapp.initialize();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Type a command:');

rl.on('line', (input) => {
  const command = input.trim().split(' ')[0];

  switch (command) {
    case 'send-whatsapp':
      sendChain();
      rl.close();
      break;
    default:
      console.log(`Unknown command: ${input}`);
      break;
  }

  if (command !== 'exit') {
    console.log('Type another command:');
  }
});

rl.on('close', () => {
  console.log('session ended.');
  process.exit(0);
});

const sendChain = async () => {
  for (let i = 0; i < UserNumbers.length; i++) {
    await sendWhatsapp(UserNumbers[i]);
    await new Promise((resolve) => setTimeout(resolve, 20000));
  }
};

const sendWhatsapp = async (phoneNumber) => {
  const numberDetails = await whatsapp.getNumberId(phoneNumber);

  if (!numberDetails) {
    console.log('no details');
    return res.send('invalid request');
  }
  try {
    console.log('sending message to>>>', numberDetails._serialized, message);
    whatsapp.sendMessage(numberDetails._serialized, message);
  } catch (error) {
    console.log('failed sending message');
  }
  console.log('Done');
};



// cambia esto
const UserNumbers = ['50763760173'];
const message = 'Hola, este es un mensaje de prueba.';
