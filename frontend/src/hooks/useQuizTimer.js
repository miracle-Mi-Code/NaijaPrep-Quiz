import { useEffect, useState } from 'react';

export function useQuizTimer(durationMinutes) {
    const totalSeconds = Number(durationMinutes) > 0 ? Number(durationMinutes) * 60 : 0;
    const [timeLeft, setTimeLeft] = useState(totalSeconds);

    useEffect(() => {
        setTimeLeft(totalSeconds);
    }, [totalSeconds]);

    useEffect(() => {
        if (!totalSeconds) {
            return undefined;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [totalSeconds]);

    return {
        minutes: Math.floor(timeLeft / 60),
        seconds: timeLeft % 60,
        isExpired: timeLeft <= 0,
    };
}
