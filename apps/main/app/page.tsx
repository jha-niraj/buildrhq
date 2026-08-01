import { redirect } from "next/navigation"

// The marketing landing now lives on the web app (shiprhq.com). This is the
// app deploy (app.shiprhq.com), so its root sends people into the product.
// Middleware handles the unauthenticated case (→ /signin).
export default function RootPage() {
    redirect("/home")
}
