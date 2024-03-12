import Success from "@/lib/Response/Success";
import ClientError from "@/lib/Response/ClientError";
import ServerError from "@/lib/Response/ServerError";

export const dynamic = 'force-dynamic' // defaults to auto

/**
 * Create a new user with `username`, `email`, and `password`
 */
export async function POST(request: Request) {
    try {
        const requestBody = await request.json();

        const username = requestBody.username;
        const email = requestBody.email;
        const password = requestBody.password;

        if(!username) return ClientError.BadRequest('Username is required');
        if(!email)    return ClientError.BadRequest('Email is required');
        if(!password) return ClientError.BadRequest('Password is required');

        return Success.OK('User Created');
    } catch(error: any) {
        return ServerError.Internal(error.toString());
    }
}