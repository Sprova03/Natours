import axios from 'axios'


const stripe = Stripe('pk_test_51HcVEcI7WjH5pY2dn1rFk63HGIKRUEE02EEsxyTs9dJFOiqSrKpGwbVskzokOJky66pquU3M15TUNR7cdMZWo6Yp00bXYEjC1Y');

export const bookTour = async tourId => {

    try{
        const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`)

        await stripe.redirectToCheckout(
            {
                sessionId: session.data.session.id
            }
        )

    }catch (err) {
        console.log(err);
    }

} 