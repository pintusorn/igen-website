'use client'


import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useState } from 'react'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const highlightedCountries = {
  TWN: {
    name: "Taiwan",
    action: "Tech youth meetups & exchange programs",
    url: "/countries/taiwan",
  },
  THA: {
    name: "Thailand",
    action: "iGEN HQ – Leadership and community service",
    url: "/countries/thailand",
  },
  MMR: {
    name: "Myanmar",
    action: "Local education empowerment projects",
    url: "/countries/myanmar",
  },
  NPL: {
    name: "Nepal",
    action: "Cultural preservation & youth engagement",
    url: "/countries/nepal",
  },
  PAK: {
    name: "Pakistan",
    action: "Sustainable innovation & volunteering",
    url: "/countries/pakistan",
  },
} as const

type CountryCode = keyof typeof highlightedCountries

export default function WorldMapHighlight() {
  const [tooltipContent, setTooltipContent] = useState<string | null>(null)

  return (
    <div className="mt-10">
      <ComposableMap
        projectionConfig={{ scale: 160, center: [100, 20] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: Array<{ rsmKey: string; properties: { ISO_A3: string } }> }) =>

            geographies.map((geo) => {
              const code = geo.properties.ISO_A3
              const isHighlighted = Object.keys(highlightedCountries).includes(code)
              const country = highlightedCountries[code as CountryCode]

              return (
                <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                        if (isHighlighted) {
                        setTooltipContent(`${country.name}: ${country.action}`)
                        }
                    }}
                    onMouseLeave={() => setTooltipContent(null)}
                    onClick={() => {
                        if (isHighlighted) {
                        window.location.href = country.url
                        }
                    }}
                    style={{
                        default: {
                        fill: isHighlighted ? "#3b82f6" : "#e0e0e0",
                        outline: "none",
                        },
                        hover: {
                        fill: isHighlighted ? "#2563eb" : "#cbd5e1",
                        outline: "none",
                        },
                        pressed: {
                        fill: "#1e40af",
                        outline: "none",
                        },
                    }}
                    fill={isHighlighted ? "#3b82f6" : "#e0e0e0"} // fallback for stubborn cases
                />

              )
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltipContent && (
        <div className="text-center mt-4 text-sm text-gray-600 italic">{tooltipContent}</div>
      )}
    </div>
  )
}
