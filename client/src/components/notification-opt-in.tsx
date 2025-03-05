import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useState } from "react";
import { requestNotificationPermission, subscribeToPushNotifications } from "@/lib/notification";
import { useToast } from "@/hooks/use-toast";

export function NotificationOptIn() {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings",
          variant: "destructive"
        });
        return;
      }

      const subscribed = await subscribeToPushNotifications();
      if (subscribed) {
        toast({
          title: "Successfully Subscribed",
          description: "You will now receive notifications from CRM"
        });
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Could not subscribe to notifications",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Enable Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Get instant updates from Dynamics CRM directly in your browser
        </p>
        <Button 
          onClick={handleSubscribe} 
          disabled={isSubscribing}
          className="w-full"
        >
          {isSubscribing ? "Subscribing..." : "Subscribe to Notifications"}
        </Button>
      </CardContent>
    </Card>
  );
}
