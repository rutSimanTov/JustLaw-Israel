import { Link } from "react-router-dom";
import { Button } from "../../components/UI/Button/button";

const ContributeLanding = () => (
  <div className="flex flex-col gap-4 max-w-md mx-auto py-10">
    <Link to="/contribute/time">
      <Button className="w-full">Contribute Your Time</Button>
    </Link>
    <Link to="/contribute/problems">
      <Button className="w-full">Contribute Problems</Button>
    </Link>
    <Link to="/contribute/ideas">
      <Button className="w-full">Contribute Ideas</Button>
    </Link>
    <Link to="/contribute/connections">
      <Button className="w-full">Contribute Connections</Button>
    </Link>
  </div>
);

export default ContributeLanding;