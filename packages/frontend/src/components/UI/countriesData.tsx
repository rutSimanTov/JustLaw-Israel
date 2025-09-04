export interface JusticeTechTool {
  name: string;
  description?: string;
  url?: string;
}

export interface CountryData {
  name: string;
  tools: JusticeTechTool[];
}

export const countriesData: CountryData[] = [
  {
    name: "United States",
    tools: [
      { 
        name: "DoNotPay", 
        url: "https://donotpay.com"
      },
      { 
        name: "Justi Guide", 
        url: "https://www.justi.guide/"
      },
      { 
        name: "SixFifty", 
        url: "https://www.sixfifty.com/"
      },
      { 
        name: "Courtroom5", 
        url: "https://courtroom5.com/"
      }
    ]
  },
  {
    name: "United Kingdom",
    tools: [
      { 
        name: "AdviceNow", 
        url: "https://www.advicenow.org.uk/"
      },
      { 
        name: "Monaco Solicitors Grapple", 
        url: "https://monacosolicitors.grapple.uk/"
      },
      { 
        name: "Separate Space", 
        url: "https://www.separatespace.co.uk/"
      }
    ]
  },
  {
    name: "Israel",
    tools: [
      { 
        name: "LateTod", 
        url: "https://www.linkedin.com/company/latetod/about/"
      },
      { 
        name: "Just Law Israel", 
        url: "https://justlawisrael.com"
      },
      { 
        name: "Flights Refund", 
        url: "https://www.flightsrefund.com"
      }
    ]
  },
  {
    name: "Czech Republic",
    tools: [
      { 
        name: "Agi Lawyer", 
        url: "https://agilawyer.com/nonprofit/"
      }
    ]
  },
  {
    name: "Singapore",
    tools: [
      { 
        name: "Video Space", 
        url: "https://videospace.co/"
      }
    ]
  },
  {
    name: "Australia",
    tools: [
      { 
        name: "Amica", 
        url: "https://amica.gov.au/"
      },
      { 
        name: "Justice Connect Pro Bono Portal", 
        url: "https://justiceconnect.org.au/about/innovation/legal-help-experience/pro-bono-portal/"
      },
      { 
        name: "Josef Legal", 
        url: "https://joseflegal.com/customers/legal-aid-and-access-to-justice/"
      }
    ]
  },
  {
    name: "Kenya",
    tools: [
      { 
        name: "eWakili", 
        url: "https://kenya.ewakili.com/"
      }
    ]
  },
  {
    name: "India",
    tools: [
      { 
        name: "Presolv360", 
        url: "https://www.presolv360.com/"
      }
    ]
  },
  {
    name: "France",
    tools: [
      { 
        name: "Demander Justice", 
        url: "https://www.demanderjustice.com/"
      },
      { 
        name: "Testamento", 
        url: "https://testamento.fr/fr/accueil"
      }
    ]
  },
  {
    name: "Spain",
    tools: [
      { 
        name: "Notario.org", 
        url: "https://notario.org/"
      },
      { 
        name: "Reclamador", 
        url: "https://www.reclamador.es/"
      },
      { 
        name: "Derecho.com", 
        url: "https://www.derecho.com/"
      }
    ]
  },
  {
    name: "Bosnia & Herzegovina",
    tools: [
      { 
        name: "Amiro", 
        url: "https://amiro.ba/en"
      }
    ]
  },
  {
    name: "Canada",
    tools: [
      { 
        name: "Willful", 
        url: "https://www.willful.co/"
      },
      { 
        name: "DivorcePath", 
        url: "https://www.divorcepath.com/"
      },
      { 
        name: "CanLII", 
        url: "https://www.canlii.org/"
      },
      { 
        name: "Clicklaw BC", 
        url: "https://www.clicklaw.bc.ca/"
      }
    ]
  }
];