import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

export default function DownvoteForm() {
  return (
    <form className="space-y-4">
      <RadioGroup value={""}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="info" id="info" />
          <Label htmlFor="info">Information Request</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="task" id="task" />
          <Label htmlFor="task">Task Request</Label>
        </div>
      </RadioGroup>
      <Button type="submit">Downvote and dismiss task</Button>
    </form>
  );
}
