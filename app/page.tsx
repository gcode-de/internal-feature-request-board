import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Internal Feature Request Board</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome! This page uses shadcn-style components. Start the dev server to see it live.
          </p>
        </CardContent>
        <CardFooter className="gap-3">
          <Button variant="default">Primary Action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Delete</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
