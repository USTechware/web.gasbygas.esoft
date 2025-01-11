import axios from "axios";
import qs from "querystring";

class SMSService {

    static formatPhoneNumber(phoneNumber: string) {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');

        if (cleanedNumber.startsWith('07')) {
            return `+94${cleanedNumber.slice(1)}`;
        } else if (cleanedNumber.startsWith('7')) {
            return `+947${cleanedNumber.slice(1)}`;
        } else if (cleanedNumber.startsWith('94') && cleanedNumber.length === 11) {
            return `+${cleanedNumber}`;
        }

        return phoneNumber;
    }

    async send(toNumber: string, body: string) {

        const payload = qs.stringify({
            'recipient': SMSService.formatPhoneNumber(toNumber),
            'sender_id': 'SendTest',
            'message': body
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://sms.send.lk/api/v3/sms/send',
            headers: {
                'Authorization': 'Bearer ' + process.env.SMS_APIKEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: payload
        };

        try {
            const result = await axios.request(config)
            console.log(result)
        } catch (error) {
            console.log('Error sending sms', error)
        }

    }

}

export default SMSService;