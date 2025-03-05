export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

export async function subscribeToPushNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY
    });

    await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription)
    });

    return true;
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
    return false;
  }
}
