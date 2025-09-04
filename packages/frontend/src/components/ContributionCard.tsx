import React from 'react';
import { Button } from '../tempSH/button';
import { Link } from 'react-router-dom';

type ContributionItem = {
  title: string;
  description: string;
  icon: string; // SVG string
  link: string;
  buttonText: string;
};

const ContributionCard: React.FC<ContributionItem> = ({
  title,
  description,
  icon,
  link,
  buttonText,
}) => {
  return (
    <div className="text-center p-8">
      <div
        className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-8 min-h-[56px]">{description}</p>
      {/* <Link to={link.startsWith('/') ? link : `/contribute/${link}`} className="w-full">
        <Button className="bg-primary hover:bg-primary/90 text-white w-full py-3 rounded-lg">
          {buttonText}
        </Button>
      </Link> */}
            <Link to={`/${link.split('/').pop()}`}>
        <Button className="bg-primary hover:bg-primary/90 text-white w-full py-3 rounded-lg">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};

export default ContributionCard;