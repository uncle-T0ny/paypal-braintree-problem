import React, {Component} from 'react';

import braintree from 'braintree-web';
import braintreeServer from 'braintree';
import paypal from 'paypal-checkout';


class App extends Component {

	componentDidMount() {
		const gateway = braintreeServer.connect({
			accessToken: 'access_token$production$m28fmbb*******', // Company A
			// accessToken: 'access_token$production$5d97cb9yrwx*******', // Company B
		});

		gateway.clientToken.generate({}, function (err, response) {
			if (err) {
				console.log('clientToken.generate err ', err);
				return;
			}
			const clientToken = response.clientToken;

			// Create a client.
			braintree.client.create({
				authorization: clientToken
			}, function (clientErr, clientInstance) {
				braintree.dataCollector.create({
					client: clientInstance,
					paypal: true
				}, function (err, dataCollectorInstance) {
					if (err) {
						console.log('dataCollector.create err', err);
						// Handle error
						return;
					}

					// savePaypalDeviceData(dataCollectorInstance.deviceData);
				});
				// Stop if there was a problem creating the client.
				// This could happen if there is a network error or if the authorization
				// is invalid.
				if (clientErr) {
					console.error('Error creating client:', clientErr);
					return;
				}

				// Create a PayPal Checkout component.
				braintree.paypalCheckout.create({
					client: clientInstance
				}, function (paypalCheckoutErr, paypalCheckoutInstance) {

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

					return;
					// Stop if there was a problem creating PayPal Checkout.
					// This could happen if there was a network error or if it's incorrectly
					// configured.
					if (paypalCheckoutErr) {
						console.error('Error creating PayPal Checkout:', paypalCheckoutErr);
						return;
					}

					// Set up PayPal with the checkout.js library
					paypal.Button.render({
						// client: 'AdxNy7wEW8l0CM29224j7y55OMN6zC3t2vjBBU79ct9zti_IJsyqoSNM6y21JlTCzM2bUkmKjdg5Vbck',
						locale: 'en_US',//PayPal button language, he_IL for Hebrew
						env: 'production', //production or sandbox
						// env: NODE_ENV === 'production' ? 'production' : 'sandbox', //production or sandbox
						commit: false, //"Pay now" label
						style: {
							size: 'medium',
							color: 'blue'
						},
						payment: function () {
							console.log('payment');
							return paypalCheckoutInstance.createPayment({
								flow: 'vault', // Required
								billingAgreementDescription: 'Your agreement description',
								locale: 'en_US', //popup language, he_IL for Hebrew
								amount: '11', // Required
								currency: 'USD', // Required
								landingPageType: 'login',//billing is for guest, login is for PayPal
								enableShippingAddress: false, //get the shipping address from the PayPal account
								shippingAddressEditable: false//, user can edit the shipping address through PayPal popup
							});
						},

						onAuthorize: function (data, actions) {
							console.log('onAuthorize', data);

							return paypalCheckoutInstance.tokenizePayment(data)
								.then(function (payload) {

									console.log('payload', payload);

									const params = {
										payment_method_nonce: payload.nonce,
										amount: 11,
										orderId: Math.floor(Math.random() * 10000) + 1
									}

									// handlePaypalPaymentServerRequest(params);

								}).catch(function(error){
									if (error === 'INSTRUMENT_DECLINED') {
										actions.restart();
									}
								});
						},

						onCancel: function (data) {
							window.location.reload();
						},

						onError: function (err) {
							window.location.reload();
						}
					}, '#paypal-button').then(function () {

					});

				});

			});
		});


	}

	render() {
		return (
			<div className="App">
				<div id="paypal-button"/>
			</div>
		);
	}
}

export default App;
