import ContactForm from "../components/contact";

export default function ContactPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
            <h1 className="text-4xl font-bold mb-6">Contact</h1>
            <ContactForm />
        </div>
    )
}