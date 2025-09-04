import { Card, CardContent, CardHeader, CardTitle } from "../tempSH/card";
import { Avatar, AvatarImage, AvatarFallback } from "../tempSH/avatar";
import { Linkedin } from "lucide-react";

type TeamMember = {
  name: string;
  title: string;
  linkedinUrl: string;
  image?: string;
};

const TeamMemberCard = ({ member }: { member: TeamMember }) => (
  <Card className="bg-card/80 text-center border-primary/20 p-4 flex flex-col h-full">
    <CardHeader className="pb-4 flex-1">
      <div className="flex justify-center mb-6">
        <Avatar className="w-32 h-32">
          {member.image && <AvatarImage src={member.image} alt={member.name} />}
          <AvatarFallback className="bg-primary/20 text-primary text-2xl font-semibold">
            {member.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardTitle className="text-xl text-primary mb-2">{member.name}</CardTitle>
      {/* זהו התיקון המומלץ: גובה מינימלי ויישור לטקסט התפקיד */}
      <p className="text-base text-gray-300 min-h-[48px] flex items-center justify-center">{member.title}</p>
    </CardHeader>
    <CardContent className="pt-0 mt-auto">
      <a
        href={member.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full hover:bg-primary/30 transition-colors"
      >
        <Linkedin className="w-6 h-6 text-primary" />
      </a>
    </CardContent>
  </Card>
);

export default TeamMemberCard;