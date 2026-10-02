import Link from 'next/link';
export default function NotFound() { return <div className="empty"><h1>Record not found</h1><p>It may have been removed from this shared workspace.</p><Link className="button" href="/">Return to overview</Link></div>; }
