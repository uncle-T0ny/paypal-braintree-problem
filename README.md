1. Edit braintree token(accessToken) in componentDidMount of the src/App.js file

2. run chrome in unsecure mode 
```
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

3. Click the paypal button

4. The problem with 
```$js
    paypalCheckoutInstance.createPayment({
        flow: 'vault', // Required
        billingAgreementDescription: 'Your agreement description',
        locale: 'en_US', //popup language, he_IL for Hebrew
        amount: '11', // Required
        currency: 'USD', // Required
        landingPageType: 'login',//billing is for guest, login is for PayPal
        enableShippingAddress: false, //get the shipping address from the PayPal account
        shippingAddressEditable: false//, user can edit the shipping address through PayPal popup
    });
```

We receive the 422 error for one paypal account at this step, but everything ok fine for other. 
