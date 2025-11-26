import ContactForm from "../components/contact";

export default function ContactPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
            <div >
           
           <h1 className="text-4xl font-bold text-center">Contact</h1>
            <ContactForm />
            </div>
        </div>
    )
}