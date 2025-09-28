import Script from "next/script";

type JsonLdProps = {
  id: string;
  data: unknown;
};

export default function JsonLd({ id, data }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

