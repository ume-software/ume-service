import { config } from "@/configs";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";

interface IGoogleTokenPlayload {
    iss: string,
    azp: string,
    aud: string,
    sub: string,
    email: string,
    email_verified: boolean,
    at_hash: string,
    name: string,
    picture: string,
    given_name: string,
    family_name: string,
    locale: string,
    iat: number,
    exp: number
}
const clientId = config.google.client_id;
const clientSecret = "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";
const oauth2Client = new OAuth2Client(clientId, clientSecret);
export class GoogleService {

    async verify(googleToken: string): Promise<IGoogleTokenPlayload> {
        const ticket = await oauth2Client.verifyIdToken({
            idToken: googleToken,
            audience: clientId
        });
        return ticket.getPayload() as IGoogleTokenPlayload
    }

    // async getUserInfo(token: string) {
    //     oauth2Client.setCredentials({ access_token: token });

    //     const people = google.people({
    //         version: 'v1',
    //         auth: oauth2Client,
    //     });

    //     const profile: any = await people.people.get({
    //         resourceName: 'people/me',
    //         personFields: 'genders,birthdays',
    //     });
    //     console.log("profile ==> ", profile)
    //     const gender = profile.data.genders && profile.data.genders.length > 0 ? profile.data.genders[0].value : null;
    //     const dateOfBirth = profile.data.birthdays && profile.data.birthdays.length > 0 ? profile.data.birthdays[0].date : null;

    //     return { gender, dateOfBirth };
    // }

    async getUserInfoWithAccessToken(accessToken: string) {
        return (await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).data
    }
}