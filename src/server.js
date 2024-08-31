const app = require('./app');
const { triggerWebhook } = require('./services/webhookService');
const { processImages } = require('./workers/imageWorker');

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            
            
            setInterval(processImages, 2*60*1000);
            setInterval(triggerWebhook, 10*60*1000);

        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

startServer();


