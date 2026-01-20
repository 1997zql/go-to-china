"use client";

import React, { useState } from "react";
import Modal from "./Modal";

type GuideItem = {
  id: string;
  title: string;
  preview: string;
  body: React.ReactNode;
};

const guideItems: GuideItem[] = [
  {
    id: "payments",
    title: "How to pay in China (Alipay, WeChat, cash)",
    preview:
      "Mobile payments are the norm. Set up Alipay or WeChat Pay before you go, and keep a backup card and some cash.",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          China is a mobile-first payment environment, and most daily purchases
          are made with QR codes. Alipay and WeChat Pay are the two dominant
          apps, and many places accept one or both. You can still use cards at
          large hotels, premium restaurants, and some shopping malls, but small
          vendors and local eateries often prefer QR payments. It is worth
          setting up both apps before your trip to reduce friction on arrival.
        </p>
        <p>
          A practical setup is to link a foreign bank card to Alipay and WeChat
          Pay, verify your identity if required, and test a small transaction in
          advance. If verification is not possible, bring a backup plan: a
          widely accepted bank card and a small amount of cash in RMB. Cash is
          still legal tender, and most vendors will accept it even if they
          prefer mobile. Keep small notes for taxis and street food, since
          change can be limited at busy times.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>Set up Alipay and WeChat Pay before departure.</li>
          <li>Link a card and complete any verification steps.</li>
          <li>Carry a second card as a fallback.</li>
          <li>Keep 200 to 500 RMB in small notes for convenience.</li>
          <li>Save digital receipts for hotels and rail tickets.</li>
          <li>Tip culture is minimal; do not over-tip by default.</li>
        </ul>
        <p>
          When you exchange currency, compare rates at banks, hotel counters,
          and airport kiosks, and keep the exchange receipt in case you need to
          convert leftover cash. Many ATMs work with international cards, but
          daily limits and fees vary, so it is smart to withdraw a modest amount
          rather than relying on one large transaction. If you pay by card, ask
          for chip-and-pin instead of swipe, and avoid dynamic currency
          conversion so you are charged in RMB rather than your home currency.
        </p>
        <p>
          For budgeting, split payments into three categories: transit, daily
          food, and attractions. This keeps spending predictable and makes it
          easier to decide when to upgrade a meal or activity. If you are
          traveling with others, agree on a shared payment method and settle up
          each evening. A small routine like this prevents surprises and keeps
          the trip smooth.
        </p>
      </div>
    ),
  },
  {
    id: "visa",
    title: "Visa-free policy and stay duration",
    preview:
      "Rules change by nationality and entry point. Confirm the latest policy before booking your flight.",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          Visa rules can change, and eligibility depends on your passport,
          entry city, and length of stay. Some travelers qualify for a short
          visa-free stay, while others need a standard tourist visa. There are
          also transit visa-free options in certain cities if you are connecting
          to a third country. The safest approach is to verify your specific
          case before you book flights or hotels, because airlines can deny
          boarding if documentation is incomplete.
        </p>
        <p>
          If you qualify for a visa-free stay, confirm the exact number of days
          allowed and the permitted entry and exit ports. If you need a visa,
          check the processing time and required documents, such as itinerary,
          hotel bookings, and proof of onward travel. Consider travel insurance
          that covers cancellations in case of visa delays. For longer or more
          complex itineraries, building in a buffer day at the start of the trip
          can reduce stress.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>Verify rules for your nationality on official sources.</li>
          <li>Confirm allowed entry and exit airports or cities.</li>
          <li>Keep digital copies of passport and visa documents.</li>
          <li>Carry proof of onward travel and accommodation.</li>
          <li>Arrive early at the airport in case of checks.</li>
          <li>Re-check rules one week before departure.</li>
        </ul>
        <p>
          Immigration officers may ask about your itinerary, so have a clear
          plan and a printout of your hotel reservations or a simple day-by-day
          outline. If you are using a visa-free or transit policy, confirm that
          your entry and exit points match the permitted cities. Staying longer
          than allowed can result in fines or travel restrictions, so be precise
          with dates and keep an eye on flight changes.
        </p>
        <p>
          For peace of mind, store a backup of your passport and visa in a
          secure cloud folder and a local copy on your phone. If your passport
          is lost, contact your embassy immediately and file a police report.
          While this is rare, having backups will save time and stress if you
          ever need them.
        </p>
      </div>
    ),
  },
  {
    id: "internet",
    title: "Internet and VPN tips",
    preview:
      "Some apps are restricted. Set up essentials before arrival and test your VPN plan in advance.",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          Internet access in China is reliable in cities, but some international
          services and apps may be restricted. Plan ahead by downloading key
          tools before your flight, including maps, translation apps, and
          messaging tools you will use with your group. If you rely on a VPN for
          work or social apps, choose a reputable provider and test it in
          advance. Performance can vary by location and network, so a backup
          option is wise.
        </p>
        <p>
          For navigation, consider offline map downloads and a local mapping
          app. Many cafes, hotels, and malls offer Wi-Fi, but you may need a
          Chinese phone number to receive a login code. A local SIM or eSIM can
          simplify this and improve stability. If you are traveling with family
          or friends, set a shared plan for messaging and location sharing so
          you do not depend on a single app that might be blocked.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>Install and test VPNs before you arrive.</li>
          <li>Download offline maps for your main cities.</li>
          <li>Set up translation apps with offline packs.</li>
          <li>Keep a backup messaging app for your group.</li>
          <li>Save hotel addresses in both English and Chinese.</li>
          <li>Prefer a local SIM or eSIM for stable access.</li>
        </ul>
        <p>
          If you need access for work, schedule important uploads or downloads
          during early morning or late evening, when networks are less busy.
          Keep a small local cache of files you might need offline, and store
          critical travel details such as train tickets and reservations in a
          note app that works without data. Simple offline preparation prevents
          you from relying on a single connection.
        </p>
        <p>
          When using public Wi-Fi, avoid logging into sensitive accounts unless
          your connection is secure. A basic habit is to use your SIM data for
          payments and bookings, and reserve public Wi-Fi for browsing maps or
          reading. This balanced approach protects your accounts while keeping
          your trip smooth.
        </p>
      </div>
    ),
  },
  {
    id: "etiquette",
    title: "Cultural etiquette",
    preview:
      "Small gestures matter. Respect quiet spaces, follow local customs, and you will be warmly received.",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          A little etiquette goes a long way in China. In temples and historic
          sites, keep voices low, avoid stepping on thresholds, and be mindful
          with photography. In cities, people move quickly and queues can be
          less rigid than in some countries, so a calm, friendly attitude helps.
          When greeting locals, a simple nod or handshake is appropriate, and
          using basic phrases like "hello" and "thank you" is always appreciated.
        </p>
        <p>
          Dining culture is social and often shared. If you are invited to a
          meal, wait for the host to begin, and place chopsticks on the rest when
          not in use. Try a few dishes from the center rather than filling your
          plate at once. Tipping is not standard in most situations. If you want
          to be respectful, focus on polite behavior and a positive attitude
          instead of extra payment.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>Keep voices low in temples and museums.</li>
          <li>Avoid touching exhibits unless permitted.</li>
          <li>Learn a few polite phrases for daily use.</li>
          <li>Do not stick chopsticks upright in rice.</li>
          <li>Ask before photographing people or vendors.</li>
          <li>Carry a business card or hotel card in Chinese.</li>
        </ul>
        <p>
          When shopping at markets, friendly bargaining can be acceptable, but
          always stay respectful and keep the tone light. If a price does not
          work, simply thank the vendor and move on. On public transport, offer
          seats to elderly passengers and keep bags close to avoid blocking
          aisles. Small gestures like this make interactions smoother and are
          widely appreciated.
        </p>
        <p>
          If you are invited to someone’s home, a small gift from your country
          is thoughtful. Avoid overly expensive items; simple treats or a small
          souvenir are perfect. When giving or receiving items, use two hands as
          a sign of respect. These details are easy to follow and leave a good
          impression.
        </p>
      </div>
    ),
  },
  {
    id: "best-time",
    title: "Best time to visit",
    preview:
      "Spring and autumn are comfortable in most regions. Avoid major holidays for lighter crowds.",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          China is vast, so the best time depends on where you plan to go. For a
          classic city and nature mix, spring and autumn are generally the most
          pleasant, with mild temperatures and lower humidity. Summer can be hot
          and crowded in popular cities, while winter is quieter and often
          colder, but also cheaper and less busy in many areas.
        </p>
        <p>
          If you are flexible, avoid major national holidays, which can bring
          significant crowding and higher prices. During peak weeks, trains and
          flights sell out quickly and tourist sites can feel rushed. If you want
          a relaxed experience, travel just before or after peak holiday periods,
          or choose a regional route where demand is lighter.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>Spring: mild weather and clear skies in many cities.</li>
          <li>Autumn: comfortable temperatures and beautiful parks.</li>
          <li>Summer: plan early mornings and evening activities.</li>
          <li>Winter: quieter sites and better hotel deals.</li>
          <li>Check local festivals for cultural experiences.</li>
          <li>Book transport early during peak travel weeks.</li>
        </ul>
        <p>
          Regional differences are significant. Northern cities can be dry and
          cold in winter, while southern areas may be damp and mild. If you plan
          to visit mountains or rural parks, shoulder seasons offer better
          visibility and more comfortable hiking conditions. For coastal cities,
          late spring and early autumn are ideal, with pleasant breezes and fewer
          storms.
        </p>
        <p>
          Build flexibility into your plan in case of weather changes. A
          well-balanced itinerary mixes indoor sites, markets, and outdoor
          highlights, so you can swap activities without losing the flow of your
          trip. This simple approach keeps your days comfortable and helps you
          make the most of each location.
        </p>
      </div>
    ),
  },
  {
    id: "transport",
    title: "Transportation basics",
    preview:
      "High-speed rail is the fastest way between major cities. Metros are clean, safe, and efficient.",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          China has one of the best transportation networks in the world. For
          intercity travel, high-speed rail is often faster and more convenient
          than flying, especially for routes under five hours. Stations are
          large and security is similar to airports, so arrive early. Tickets
          can sell out on busy days, so booking ahead helps keep your itinerary
          smooth.
        </p>
        <p>
          Within cities, metro systems are reliable and inexpensive. Ride-hailing
          apps are widely used and can be more convenient than flagging taxis,
          especially during rain or late hours. If you use taxis, keep your
          destination written in Chinese. For domestic flights, expect security
          checks and potential delays, so build in some buffer time.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>Use high-speed rail for major city pairs.</li>
          <li>Arrive 45 to 60 minutes before departure.</li>
          <li>Keep passports handy for ticket checks.</li>
          <li>Use metro cards or QR tickets for speed.</li>
          <li>Save your hotel address in Chinese.</li>
          <li>Plan transfers with luggage in mind.</li>
        </ul>
        <p>
          For long rail journeys, consider seat class based on comfort and
          duration. Second class is efficient and affordable, while first class
          offers a quieter ride and more space. At major stations, follow the
          English signage and keep a screenshot of your train number and gate,
          as platforms can change shortly before boarding.
        </p>
        <p>
          In cities, walking often reveals hidden alleys and local cafes, but
          distances can be larger than they appear on a map. Pair short walks
          with metro rides to keep your energy up. This combination gives you
          both the practicality of fast transport and the pleasure of exploring
          on foot.
        </p>
      </div>
    ),
  },
  {
    id: "safety",
    title: "Safety tips",
    preview:
      "China is generally safe, but use the same awareness you would in any large city.",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          Most travelers find China safe and welcoming. As with any major
          destination, the key is to stay aware of your surroundings, especially
          in crowded markets and transit hubs. Keep your passport secure, and
          carry a copy of it in your day bag. If you are traveling solo, share
          your daily plan with a friend or family member and check in regularly.
        </p>
        <p>
          Avoid overly aggressive sales tactics and scams, such as unofficial
          guides offering deals that feel too good to be true. Use official taxi
          lines, book transportation through trusted platforms, and confirm
          prices when possible. Basic travel insurance and a small first-aid kit
          can add peace of mind, especially if you are visiting remote areas or
          hiking.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>Keep valuables in a zipped inner pocket.</li>
          <li>Use official ticket counters and platforms.</li>
          <li>Save emergency contacts and local numbers.</li>
          <li>Stay hydrated and pace yourself in heat.</li>
          <li>Check local advisories for weather events.</li>
          <li>Know your hotel address in Chinese.</li>
        </ul>
        <p>
          If you need medical care, large hospitals in major cities usually have
          international clinics, though wait times can vary. Keep your insurance
          details available and carry any prescriptions in their original
          packaging. Basic travel health habits such as regular water breaks and
          wearing a mask in crowded indoor spaces can help you avoid common
          travel fatigue.
        </p>
        <p>
          A simple emergency plan is helpful: know how to reach your embassy,
          have a local emergency number saved on your phone, and keep a small
          amount of backup cash separate from your wallet. These steps are
          low-effort but provide reassurance if something unexpected happens.
        </p>
      </div>
    ),
  },
  {
    id: "sim",
    title: "SIM card and eSIM",
    preview:
      "An eSIM is the easiest option if your phone supports it. Airport kiosks also sell local SIMs.",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          A local data plan makes navigation, payments, and messaging much
          easier. If your phone supports eSIM, you can buy a plan before you
          leave and activate it on arrival. This avoids queues at the airport
          and ensures you have data immediately. Physical SIM cards are widely
          available at airports and city shops, but you may need to show your
          passport for registration.
        </p>
        <p>
          Choose a plan that matches your itinerary. City trips usually need
          less data, while longer journeys and remote areas benefit from higher
          allowances. Check whether the plan supports hotspot sharing if you
          want to connect a second device. Keep your home SIM in a safe place
          so you can swap it back when you leave.
        </p>
        <ul className="list-disc space-y-2 pl-4">
          <li>Confirm your phone is unlocked before travel.</li>
          <li>Buy an eSIM if you want instant connectivity.</li>
          <li>Carry your passport for SIM registration.</li>
          <li>Test data and messaging before leaving the airport.</li>
          <li>Keep a SIM tool and store your home SIM safely.</li>
          <li>Consider a plan with hotspot support.</li>
        </ul>
        <p>
          Some plans include access to international services, while others are
          optimized for local apps. Read the plan description carefully and pick
          the option that matches your needs. If you rely on stable connections
          for work calls, prioritize higher data limits and broader network
          coverage. For short city breaks, a smaller plan is often enough and
          can be more cost-effective.
        </p>
        <p>
          Keep your phone settings ready: know where the APN settings live, turn
          on roaming only if needed, and label your SIM cards so you do not mix
          them up. These small setup steps can save time and prevent confusion
          if you need to switch back to your home SIM during transit.
        </p>
      </div>
    ),
  },
];

export default function GuideCards() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = guideItems.find((item) => item.id === activeId);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {guideItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className="card text-left transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer"
          >
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.preview}</p>
            <div className="mt-3 text-xs text-slate-500">Click to expand</div>
          </button>
        ))}
      </div>

      <Modal
        open={Boolean(active)}
        title={active?.title || ""}
        onClose={() => setActiveId(null)}
      >
        {active?.body}
      </Modal>
    </>
  );
}
