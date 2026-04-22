import { useState } from "react";
import { FaExternalLinkAlt, FaSearch } from "react-icons/fa";

import image1 from "../../../assets/images/govtlinks/seva sindhu.jpeg";
import image2 from "../../../assets/images/govtlinks/revenue.avif";
import image3 from "../../../assets/images/govtlinks/naadakacheri.jpeg";
import image4 from "../../../assets/images/govtlinks/parihara.webp";
import image5 from "../../../assets/images/govtlinks/e-swathu.webp";
import image6 from "../../../assets/images/govtlinks/kla.jpg";
import image7 from "../../../assets/images/govtlinks/kaveri.jpg";
import image8 from "../../../assets/images/govtlinks/voter.jpg";
import image9 from "../../../assets/images/govtlinks/vijaykarnataka.avif";
import image10 from "../../../assets/images/govtlinks/janaspandan.jpeg";
import image11 from "../../../assets/images/govtlinks/court.jpg";
import image12 from "../../../assets/images/govtlinks/ration card.avif";
import image13 from "../../../assets/images/govtlinks/suraksha.jpg";
import image14 from "../../../assets/images/govtlinks/mojini.jpg";
import image15 from "../../../assets/images/govtlinks/pollstar.webp";

type Portal = {
  name: string;
  url: string;
  description: string;
  image: string;
};

const portals: Portal[] = [
  {
    name: "ಸೇವಾ ಸಿಂಧು",
    url: "https://sevasindhuservices.karnataka.gov.in/login.do",
    description: "ಸರ್ಕಾರದ ವಿವಿಧ ನಾಗರಿಕ ಸೇವೆಗಳನ್ನು ಆನ್‌ಲೈನ್ ಮೂಲಕ ಪಡೆಯುವ ಪೋರ್ಟಲ್",
    image: image1,
  },
  {
    name: "ನಾಡಕಚೇರಿ",
    url: "https://ajsk.karnataka.gov.in/NK5_Online/Login/Login_Public",
    description: "ಆದಾಯ, ಜಾತಿ ಮತ್ತು ನಿವಾಸ ಪ್ರಮಾಣಪತ್ರಗಳಿಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಸೇವೆ",
    image: image3,
  },
  {
    name: "ಕಂದಾಯ ಇಲಾಖೆ",
    url: "https://dssp.karnataka.gov.in/dssp/Beneficiary_Status.aspx",
    description: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಲಾಭಾರ್ಥಿಗಳ ಸ್ಥಿತಿ ಮತ್ತು ಮಾಹಿತಿ ಪರಿಶೀಲನೆ",
    image: image2,
  },
  {
    name: "ಭೂಮಿ RTC",
    url: "https://landrecords.karnataka.gov.in",
    description: "ಭೂಮಿಯ ದಾಖಲೆಗಳು (RTC, ಪಹಣಿ) ಪರಿಶೀಲನೆ ಮತ್ತು ಡೌನ್‌ಲೋಡ್",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
  },
  {
    name: "ಮುಖ್ಯಮಂತ್ರಿ ಪರಿಹಾರ ನಿಧಿ",
    url: "https://cmrf.karnataka.gov.in/intranet/Login_Kann.aspx",
    description: "ಆರ್ಥಿಕ ಸಹಾಯಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಮತ್ತು ಸ್ಥಿತಿ ತಿಳಿಯಲು",
    image: image4,
  },
  {
    name: "ಮೋಜಿಣಿ",
    url: "https://bhoomojini.karnataka.gov.in/",
    description: "ಭೂಮಿ ಅಳತೆ ಮತ್ತು ಸರ್ವೇಗೆ ಸಂಬಂಧಿಸಿದ ಸೇವೆಗಳು",
    image:image14,
  },

  {
    name: "ಇ-ಸ್ವತ್ತು 2.0",
    url: "https://eswathu.karnataka.gov.in/",
    description: "ಗ್ರಾಮ ಪಂಚಾಯತ್ ಆಸ್ತಿ ದಾಖಲೆಗಳ ನಿರ್ವಹಣೆ ಮತ್ತು ಪ್ರಮಾಣಪತ್ರಗಳು",
    image:image5,
  },

  {
    name: "ಕರ್ನಾಟಕ ವಿಧಾನಸಭೆ",
    url: "https://kla.kar.nic.in/assembly/assembly.htm",
    description: "ವಿಧಾನಸಭೆಯ ಮಾಹಿತಿ, ಸದಸ್ಯರು ಮತ್ತು ಕಾರ್ಯಚಟುವಟಿಕೆಗಳ ವಿವರ",
    image:image6,
  },

  {
    name: "ಕಾವೇರಿ ಆನ್‌ಲೈನ್ ಸೇವೆಗಳು",
    url: "https://kaveri.karnataka.gov.in/landing-page",
    description: "ಆಸ್ತಿ ನೋಂದಣಿ, ಮುದ್ರಾಂಕ ಮತ್ತು ದಾಖಲೆ ಸೇವೆಗಳು",
    image:image7,
  },

  {
    name: "ಚುನಾವಣಾ ಸೇವೆ",
    url: "https://ceo.karnataka.gov.in/363/electoral-roll--2002/en",
    description: "ಮತದಾರರ ಮಾಹಿತಿ, ಮತದಾರ ಪಟ್ಟಿಯ ಪರಿಶೀಲನೆ ಮತ್ತು ಚುನಾವಣಾ ಸೇವೆಗಳು",
    image:image8,
  },

  {
    name: "ಕುಟುಂಬ",
    url: "https://kutumba.karnataka.gov.in/kn/Index",
    description: "ಕುಟುಂಬದ ಸದಸ್ಯರ ಮತ್ತು ಸರ್ಕಾರಿ ದಾಖಲೆಗಳ ವಿವರಗಳ ನಿರ್ವಹಣೆ",
    image:image9,
  },

  {
    name: "ಜನಸ್ಪಂದನ",
    url: "https://ipgrs.karnataka.gov.in/",
    description: "ಸಾರ್ವಜನಿಕರ ಕುಂದುಕೊರತೆಗಳನ್ನು ದಾಖಲಿಸಿ ಪರಿಹಾರ ಪಡೆಯುವ ವ್ಯವಸ್ಥೆ",
    image:image10,
  },

  {
    name: "E-Court",
    url: "https://ecourts.gov.in/ecourts_home/",
    description: "ನ್ಯಾಯಾಲಯ ಪ್ರಕರಣಗಳ ಸ್ಥಿತಿ, ಆದೇಶಗಳು ಮತ್ತು ದಿನಾಂಕಗಳ ಮಾಹಿತಿ",
    image:image11,
  },

  {
    name: "ಭೂ ಸುರಕ್ಷಾ",
    url: "https://recordroom.karnataka.gov.in/service4",
    description: "ಭೂ ದಾಖಲೆಗಳ ಸುರಕ್ಷತೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಸೇವೆಗಳ ಪ್ರವೇಶ",
    image:image13,
  },

  {
    name: "ಆಹಾರ ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ",
    url: "https://ahara.karnataka.gov.in/",
    description: "ರೇಷನ್ ಕಾರ್ಡ್, ಅನ್ನಭಾಗ್ಯ ಮತ್ತು ಆಹಾರ ವಿತರಣೆ ಸೇವೆಗಳ ಮಾಹಿತಿ",
    image:image12,
  },

   {
    name: "ಪೋಲ್‌ಸ್ಟಾರ್",
    url: "https://ems.outvote.in",
    description: "ತಾಲ್ಲೂಕಿನ ಎಲ್ಲಾ ಮತದಾರರ ಸಂಪೂರ್ಣ ವಿವರಗಳ ಮಾಹಿತಿ.",
    image:image15,
  },
];

export default function GovtLinksPage() {
  const [search, setSearch] = useState("");

  // ✅ FILTER ONLY BY SEARCH
  const filtered = portals.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-gray-100">

  {/* HEADER */}
  <div className="bg-white shadow-sm p-4 sticky top-0 z-20">
    <h1 className="text-xl font-semibold mb-3 text-gray-800">
      ಸರ್ಕಾರದ ಸೇವೆಗಳು
    </h1>

    <div className="relative">
      <FaSearch className="absolute left-3 top-3 text-gray-400" />
      <input
        placeholder="ಹುಡುಕಿ..."
        className="w-full border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none rounded-lg pl-10 pr-3 py-2 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>

  {/* BODY */}
  <div className="flex-1 overflow-auto p-4">

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      {filtered?.map((p, i) => (
        <div
          key={i}
          className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition duration-300 flex flex-col"
        >

          {/* IMAGE */}
          <div className="relative h-28 overflow-hidden">
            <img
              src={p.image}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://via.placeholder.com/400x200")
              }
            />

            {/* TOP LABEL */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-2 left-3 text-white">
              <h3 className="font-semibold text-base leading-tight">
                {p.name}
              </h3>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-3 flex flex-col flex-1 justify-between">

            <p className="text-md text-gray-500 mb-3 line-clamp-2">
              {p.description}
            </p>

            <a
              href={p.url}
              target="_blank"
              className="mt-auto bg-[#265899] hover:bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white  py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 transition"
            >
              ತೆರೆಯಿರಿ <FaExternalLinkAlt size={12} />
            </a>

          </div>
        </div>
      ))}

    </div>

    {/* EMPTY */}
    {filtered?.length === 0 && (
      <div className="text-center text-gray-400 mt-10">
        ಯಾವುದೇ ಸೇವೆಗಳು ಇಲ್ಲ
      </div>
    )}
  </div>
</div>
  );
}