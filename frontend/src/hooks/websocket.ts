import {useCallback, useRef, useState} from 'react';

export function useWebSocket() {
    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
        const ws = new WebSocket('ws://127.0.0.1:3030/ws');

        ws.onmessage = (event) => {
            setLastMessage(event);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        wsRef.current = ws;
    }, []);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    }, []);

    const sendMessage = useCallback((data: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(data);
        }
    }, []);

    return { connect, disconnect, sendMessage, lastMessage };
}