import { User } from "@/models/User";

export async function GET(req: Request) {
try {
    const url = new URL(req.url);
    const role = url.searchParams.get('role');

    if (!role) {
        return new Response("Role parameter is missing", { status: 400 });
    }

    const users = await User.find({ role });
    return new Response(JSON.stringify({ users }), { status: 200 });
} catch (error) {
    return new Response("Failed to fetch users", { status: 500 });
}
}