export interface StateInfo {
  name: string;
  cities: string[];
}

export interface CountryInfo {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
  states: StateInfo[];
}

export const COUNTRIES_DATA: CountryInfo[] = [
  {
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    dialCode: "+91",
    states: [
      {
        name: "Odisha",
        cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur", "Berhampur", "Balasore", "Jharsuguda", "Baripada", "Rayagada", "Bhadrak", "Balangir", "Angul", "Dhenkanal", "Jeypore", "Kendrapara"]
      },
      {
        name: "Maharashtra",
        cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad (Chhatrapati Sambhajinagar)", "Navi Mumbai", "Solapur", "Amravati", "Kolhapur", "Nanded", "Sangli", "Jalgaon", "Akola", "Latur", "Dhule"]
      },
      {
        name: "Karnataka",
        cities: ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Tumakuru", "Shivamogga", "Vijayapura", "Kalaburagi", "Udupi", "Hassan", "Bidar"]
      },
      {
        name: "Delhi (NCT)",
        cities: ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "Dwarka", "Rohini", "Connaught Place", "Vasant Kunj", "Saket"]
      },
      {
        name: "Tamil Nadu",
        cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Tirunelveli", "Thoothukudi", "Kanchipuram", "Thanjavur", "Dindigul"]
      },
      {
        name: "Telangana",
        cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Siddipet", "Miryalaguda"]
      },
      {
        name: "Gujarat",
        cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Bharuch", "Vapi", "Morbi", "Navsari"]
      },
      {
        name: "West Bengal",
        cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Kharagpur", "Haldia", "Jalpaiguri", "Darjeeling", "Baharampur"]
      },
      {
        name: "Uttar Pradesh",
        cities: ["Lucknow", "Kanpur", "Noida", "Greater Noida", "Ghaziabad", "Agra", "Varanasi", "Prayagraj (Allahabad)", "Meerut", "Bareilly", "Aligarh", "Moradabad", "Gorakhpur", "Jhansi", "Saharanpur", "Ayodhya"]
      },
      {
        name: "Haryana",
        cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa"]
      },
      {
        name: "Punjab",
        cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali (SAS Nagar)", "Pathankot", "Hoshiarpur", "Batala", "Moga"]
      },
      {
        name: "Kerala",
        cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kannur", "Kottayam", "Malappuram", "Thalassery"]
      },
      {
        name: "Rajasthan",
        cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Bharatpur", "Pali", "Chittorgarh"]
      },
      {
        name: "Madhya Pradesh",
        cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Katni", "Singrauli"]
      },
      {
        name: "Andhra Pradesh",
        cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajamahendravaram", "Tirupati", "Kakinada", "Eluru", "Anantapur", "Kadapa"]
      },
      {
        name: "Bihar",
        cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar", "Munger"]
      },
      {
        name: "Assam",
        cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon"]
      },
      {
        name: "Chhattisgarh",
        cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Ambikapur"]
      },
      {
        name: "Goa",
        cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"]
      },
      {
        name: "Himachal Pradesh",
        cities: ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Hamirpur", "Bilaspur", "Baddi"]
      },
      {
        name: "Jharkhand",
        cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh"]
      },
      {
        name: "Jammu & Kashmir",
        cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua", "Sopore"]
      },
      {
        name: "Ladakh",
        cities: ["Leh", "Kargil"]
      },
      {
        name: "Uttarakhand",
        cities: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh", "Nainital", "Rudrapur", "Kashipur"]
      },
      {
        name: "Puducherry",
        cities: ["Puducherry", "Karaikal", "Mahe", "Yanam"]
      },
      {
        name: "Chandigarh",
        cities: ["Chandigarh"]
      },
      {
        name: "Meghalaya",
        cities: ["Shillong", "Tura", "Jowai", "Nongpoh"]
      },
      {
        name: "Manipur",
        cities: ["Imphal", "Churachandpur", "Thoubal", "Bishnupur"]
      },
      {
        name: "Tripura",
        cities: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"]
      },
      {
        name: "Nagaland",
        cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang"]
      },
      {
        name: "Arunachal Pradesh",
        cities: ["Itanagar", "Naharlagun", "Pasighat", "Tawang"]
      },
      {
        name: "Sikkim",
        cities: ["Gangtok", "Namchi", "Geyzing", "Mangan"]
      },
      {
        name: "Mizoram",
        cities: ["Aizawl", "Lunglei", "Champhai"]
      },
      {
        name: "Andaman & Nicobar Islands",
        cities: ["Port Blair"]
      }
    ]
  },
  {
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    dialCode: "+1",
    states: [
      {
        name: "California",
        cities: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Fresno", "Oakland", "Palo Alto", "Irvine"]
      },
      {
        name: "New York",
        cities: ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse", "Yonkers"]
      },
      {
        name: "Texas",
        cities: ["Houston", "Austin", "Dallas", "San Antonio", "Fort Worth", "El Paso", "Arlington"]
      },
      {
        name: "Florida",
        cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "Tallahassee"]
      },
      {
        name: "Illinois",
        cities: ["Chicago", "Aurora", "Naperville", "Rockford", "Springfield"]
      },
      {
        name: "Washington",
        cities: ["Seattle", "Spokane", "Tacoma", "Bellevue", "Redmond"]
      },
      {
        name: "Massachusetts",
        cities: ["Boston", "Cambridge", "Worcester", "Springfield"]
      }
    ]
  },
  {
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    dialCode: "+44",
    states: [
      {
        name: "England",
        cities: ["London", "Manchester", "Birmingham", "Leeds", "Liverpool", "Bristol", "Cambridge", "Oxford", "Sheffield"]
      },
      {
        name: "Scotland",
        cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"]
      },
      {
        name: "Wales",
        cities: ["Cardiff", "Swansea", "Newport", "Bangor"]
      },
      {
        name: "Northern Ireland",
        cities: ["Belfast", "Derry", "Lisburn", "Newry"]
      }
    ]
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    dialCode: "+971",
    states: [
      {
        name: "Dubai",
        cities: ["Dubai City", "Downtown Dubai", "Dubai Marina", "Jumeirah", "Business Bay", "Deira"]
      },
      {
        name: "Abu Dhabi",
        cities: ["Abu Dhabi City", "Al Ain", "Al Dhafra", "Ruwais"]
      },
      {
        name: "Sharjah",
        cities: ["Sharjah City", "Khor Fakkan", "Kalba"]
      },
      {
        name: "Ajman",
        cities: ["Ajman City"]
      },
      {
        name: "Ras Al Khaimah",
        cities: ["Ras Al Khaimah City"]
      }
    ]
  },
  {
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    dialCode: "+1",
    states: [
      {
        name: "Ontario",
        cities: ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Waterloo"]
      },
      {
        name: "Quebec",
        cities: ["Montreal", "Quebec City", "Laval", "Gatineau", "Sherbrooke"]
      },
      {
        name: "British Columbia",
        cities: ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond", "Kelowna"]
      },
      {
        name: "Alberta",
        cities: ["Calgary", "Edmonton", "Red Deer", "Lethbridge"]
      }
    ]
  },
  {
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    dialCode: "+61",
    states: [
      {
        name: "New South Wales",
        cities: ["Sydney", "Newcastle", "Wollongong", "Central Coast"]
      },
      {
        name: "Victoria",
        cities: ["Melbourne", "Geelong", "Ballarat", "Bendigo"]
      },
      {
        name: "Queensland",
        cities: ["Brisbane", "Gold Coast", "Cairns", "Townsville", "Sunshine Coast"]
      },
      {
        name: "Western Australia",
        cities: ["Perth", "Fremantle", "Mandurah"]
      }
    ]
  },
  {
    name: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    dialCode: "+65",
    states: [
      {
        name: "Central Region",
        cities: ["Singapore", "Marina Bay", "Orchard", "Tanjong Pagar"]
      },
      {
        name: "East Region",
        cities: ["Changi", "Tampines", "Bedok", "Pasir Ris"]
      }
    ]
  },
  {
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    dialCode: "+49",
    states: [
      {
        name: "Bavaria",
        cities: ["Munich", "Nuremberg", "Augsburg", "Regensburg"]
      },
      {
        name: "Berlin",
        cities: ["Berlin"]
      },
      {
        name: "North Rhine-Westphalia",
        cities: ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Bonn"]
      }
    ]
  }
];

export function getCountryByDialCode(dialCode: string): CountryInfo | undefined {
  return COUNTRIES_DATA.find((c) => c.dialCode === dialCode);
}

export function getCountryByName(name: string): CountryInfo | undefined {
  return COUNTRIES_DATA.find((c) => c.name.toLowerCase() === name.toLowerCase());
}
