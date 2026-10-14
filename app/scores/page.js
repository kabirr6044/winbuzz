import Scoreboard from './scoreboard';
import snapshot from '../../reference/scores.json';
export const metadata={title:'Live Cricket Score Widget - cwidget.crictimes.org'};
export default function Scores(){return <><link rel="stylesheet" href="/score-widget.css"/><link rel="stylesheet" href="/score-widget-local.css"/><Scoreboard initial={snapshot}/></>}
