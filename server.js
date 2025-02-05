const express = require('express');
const stripe = require('stripe')('sk_test_51QoawJPAsFLDrstCA4Zmpj3D90o9atBNIvayzoYnLLxVjKOJCtrkGFgblWKPz3OyPeGuXudnXyMmSAobI9U5CALH00iPjcaLXX');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/process_payment', async (req, res) => {
    const { token, amount } = req.body;

    try {
        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            source: token,
            description: 'Purchase of Mustafa Mahmoud book',
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
