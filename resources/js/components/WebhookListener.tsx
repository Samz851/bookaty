import React, { useEffect, useState } from 'react';
import Echo from 'laravel-echo';

interface WebhookData {
    [key: string]: any;
}

const WebhookListener: React.FC = () => {
    const [webhooks, setWebhooks] = useState<WebhookData[]>([]);

    useEffect(() => {
        // Initialize Laravel Echo
        const echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true
        });

        // Listen for webhook events
        echo.channel('webhooks')
            .listen('WebhookReceived', (e: { data: WebhookData }) => {
                setWebhooks(prev => [...prev, e.data]);
            });

        // Cleanup on unmount
        return () => {
            echo.leave('webhooks');
        };
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Webhook Events</h2>
            <div className="space-y-4">
                {webhooks.map((webhook, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                        <pre className="whitespace-pre-wrap">
                            {JSON.stringify(webhook, null, 2)}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WebhookListener; 