export default function LoginPage() {

    return (
        <form class="flex flex-col gap-2">
            <label for="username" class="font-semibold">Username:</label>
            <input
                type="text"
                id="username"
                name="username"
                class="border p-2 rounded-md focus:outline-none focus:ring"
            />
            <label for="password" class="font-semibold">Password:</label>
            <input
                type="text"
                id="password"
                name="password"
                class="border p-2 rounded-md focus:outline-none focus:ring"
            />
        </form>

    );

}