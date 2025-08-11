import Hero from "../components/Hero";

export default function Donate() {
  return (
    <>
      <Hero
        title="Support Our Church"
        subtitle="Help Us Continue Our Mission Through Your Generosity"
        backgroundImage="/images/donate-hero.jpg"
      />
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-bold mb-4">Donate</h1>
        <p className="text-gray-700 mb-4">
          Your contributions help sustain our programs and outreach. Thank you
          for your generosity.
        </p>
        <button className="bg-green-600 text-white px-6 py-2 rounded">
          Donate Now
        </button>
      </div>
    </>
  );
}
