'use client';
export default function ErrorPage({reset}:{reset:()=>void}) { return <div className="empty error-panel"><h1>We couldn’t load your portfolio</h1><p>The database may be temporarily unavailable. Please try again.</p><button onClick={() => reset()}>Try again</button></div>; }
