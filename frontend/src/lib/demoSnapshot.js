export function makeSnapshot(title = '6-Month Internship Decision') {
  const decision = {
    title,
    decision: title.toLowerCase().includes('internship') ? 'Should I accept this 6-month internship?' : `Should I choose ${title.toLowerCase()}?`,
    options: ['Accept', 'Decline'],
    priorities: ['Learning', 'Time', 'Career growth'],
    reasons: 'The visible benefit is strong industry exposure, useful experience and a convenient location.',
    constraints: 'Academic workload and the amount of real mentorship are not fully verified.',
    known_facts: 'The internship lasts six months and requires a regular weekly commitment.',
  };
  const analysis = {
    summary: 'Your reasoning has clear visible drivers, but several links between those drivers and the desired outcome still depend on assumptions or missing evidence.',
    reasoning_map: {
      decision: decision.decision,
      reasons: ['Good stipend', 'Industry experience', 'Close to home'],
      facts: ['6-month duration', 'Weekly time commitment'],
      assumption_labels: ['This experience will improve my career prospects', 'Mentorship will be sufficient'],
      blind_spot_labels: ['Academic impact', 'Opportunity cost'],
      conflict_labels: ['Short-term gain vs long-term fit'],
    },
    assumptions: [
      {title:'This experience will improve my career prospects',description:'The reasoning links the internship to long-term career growth, but the quality of work and mentorship are not yet verified.',why_it_matters:'A role can provide experience without providing relevant skill growth.',confidence:'High'},
      {title:'The academic trade-off will be manageable',description:'The current reasoning does not explain how the workload fits alongside college commitments.',why_it_matters:'The constraint may become the limiting factor even if the opportunity is attractive.',confidence:'Medium'},
    ],
    blind_spots:[
      {title:'Academic impact',description:'The reasoning focuses on the internship benefits more than the effect on coursework, exams and recovery time.',why_it_matters:'The cost of the option is less visible than the direct benefit.'},
      {title:'Opportunity cost',description:'Other roles, projects or study opportunities you would give up are not considered.',why_it_matters:'Choosing one path changes what remains available later.'},
    ],
    conflicts:[{title:'Short-term gain vs long-term fit',description:'Immediate money and experience may compete with academic performance or your longer-term target role.',tension:'The reasoning does not yet explain how both priorities can be satisfied.'}],
    evidence_gaps:[{claim:'This internship will create the expected career benefit',missing_evidence:'Specific proof about actual work, mentorship and relevance to your target career.',verification_method:'Ask for project examples, mentor details and evidence from previous interns.'}],
    critical_questions:['What would change your mind about this decision?','What are you assuming to be true without direct evidence?','What are you giving up by choosing this option?','What would happen if the mentorship is weaker than expected?','Which fact would you most want to verify before deciding?','What does success look like six months after this choice?'],
  };
  return {decision, analysis};
}
