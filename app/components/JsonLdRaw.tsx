export default function JsonLdRaw({ id, data }: { id: string; data: unknown }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // SSR-visible JSON-LD (no Next Script timing)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

