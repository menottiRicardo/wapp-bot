const qrcode = require('qrcode-terminal');
const { Client, LocalAuth,MessageMedia } = require('./index');
const vCardParser = require('./parser')
const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const whatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    },
});

// whatsapp
whatsapp.on('qr', (qr) => {
    qrcode.generate(qr, {
        small: true,
    });
});

whatsapp.on('ready', () => {
    console.log('Whatsapp esta listo!');
    console.log('Escribe un comando:');
    console.log('-> salir')
    console.log('-> enviar-lista')
});

// cli
rl.on('line', (input) => {
    console.log(`Recibido: ${input}`);

    // Handle different commands
    switch (input.trim()) {
        case 'salir':
            console.log('Saliendo...');
            rl.close();
            break;
        case 'enviar':
            console.log('Enviando lista...');
            sendList();
            break;
        default:
            console.log(`Unknown command: ${input}`);
            break;
    }

    if (input.trim() !== 'exit') {
        console.log('Type another command:');
    }
});

rl.on('close', () => {
    console.log('Sesion de terminal concluida.');
    process.exit(0);
});
// routes


const sendList = async() => {
    // get contacts file
    const rawContacts = fs.readFileSync('archivos/contactos.vcf', 'utf8');
    const contacts = vCardParser.parse(rawContacts)


    // get message from txt
    const message = fs.readFileSync('archivos/mensaje.txt', 'utf8');

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const number = contact.telephone[0].value;
        sendMessage(number, message);
        await new Promise(r => setTimeout(r, 5000));
    }
}
const sendMessage = async(phoneNumber, message) => {

    if (!phoneNumber || !message) {
        console.log('not message nor number', phoneNumber, message);
        return;
    }

    if (phoneNumber.includes('+')) {
        console.log('phone includes', phoneNumber);
        phoneNumber = phoneNumber.split('+')[1];
        phoneNumber = phoneNumber.slice(0,-3)
    }
    console.log('enviando mensaje a ', phoneNumber);

    const numberDetails = await whatsapp.getNumberId(phoneNumber);

    if (!numberDetails) {
        console.log('no encontramos los detalles');
        return
    }
    try {
        await whatsapp.sendMessage(numberDetails._serialized, message);
        const media = MessageMedia.fromFilePath('./archivos/catalogo.pdf');
        await new Promise(r => setTimeout(r, 1000));
        await whatsapp.sendMessage(numberDetails._serialized, media);
    } catch (error) {
        console.log('error', error);
    }
    console.log('mensaje enviado a ', numberDetails);
}

whatsapp.initialize();