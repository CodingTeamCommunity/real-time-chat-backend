import crypto from "crypto";
import { dbPool } from "./auth.js";
import { configDotenv } from "dotenv";
import { Resend } from 'resend';

configDotenv();

export const resend = new Resend(process.env.RESEND_API_KEY);



const generateVerificationToken = (): string => {
    return crypto.randomBytes(32).toString("base64url");//random token of size 32 bytes
}


export const sendVerificationToken = async(email:string)=>{

    const token = generateVerificationToken();

    //delete existing tokens for that user
    await dbPool.query(
    `DELETE FROM verification
     WHERE identifier = $1`,
    [email]
    );

    //upload to database
    await dbPool.query(
        `INSERT INTO verification(
        id, identifier, value, "expiresAt")
        VALUES ($1, $2, $3, $4)`,
        [
            crypto.randomUUID(),
            email,
            token,
            new Date(Date.now() + 15 * 60 * 1000)
        ]
    );//inserts into verification table

    const verificationURL = `${process.env.APP_URL}/verify?token=${token}`;//verification url
    //send the email

    const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'Verify Your Email',
    html: `
        <h1>Verify Your Email</h1>
        <p> Click the Link Below to Verify:</p>
        <a href="${verificationURL}">
            Verify Email
        </a>`

  });

  if (error){
    throw error;

  }
  return data;
    
}
//on verification click
export const verifyUserEmail = async(userToken: string) =>{


    const { rows } = await dbPool.query(`SELECT * FROM verification WHERE value = $1 AND "expiresAt" > NOW()`,
        [userToken]);


    if (rows.length === 0) throw new Error("Invalid or expired token");

    //get email from query
    const email = rows[0].identifier;

    //verify the user
    await dbPool.query(`UPDATE "user" SET "emailVerified" = true WHERE email = $1`,
    [email]);


    //delete from db
    await dbPool.query("DELETE FROM verification WHERE id = $1", [rows[0].id]);
}
