import groupBy from "lodash/groupBy";

export type OptionType = {
  prompt_id: string;
  prompt_condition: string;
  button_option: string;
  button_text: string;
  next_prompt_id: string;
  score: number;
  chance: number;
  chance_score: number;
};

export type PromptType = {
  prompt_id: string;
  prompt_condition: string;
  initial_text: string;
  expanded_text_left_succeed: string;
  expanded_text_left_fail: string;
  expanded_text_right_succeed: string;
  expanded_text_right_fail: string;
  options: {
    left: OptionType;
    right: OptionType;
  };
};

const prompts = [
  {
    prompt_id: "prompt_one",
    prompt_condition: "public",
    initial_text: "There are three counselors for 1,200 students at your school. It would be great to get advice on how to write a strong personal essay or obtain letters of recommendation. Do you...",
    expanded_text_left_succeed: "<strong>You wait two hours and now feel much more confident about your applications. </strong>The American School Counselor Association recommends that a school counselor’s caseload be limited to <a href=\"https://www.schoolcounselor.org/press\">250 students</a>. The national average is <a href=\"https://www.nacacnet.org/news--publications/Research/state-by-state-student-to-counselor-ratio-report2/\">482 students</a> per counselor. Counselors can be critical for guiding <a href=\"https://hechingerreport.org/what-do-philadelphias-students-want-more-college-counseling/\">students through the application process</a>.",
    expanded_text_left_fail: "<strong>You wait two hours but don’t get in to see a counselor.</strong> The American School Counselor Association recommends that a school counselor’s caseload be limited to <a href=\"https://www.schoolcounselor.org/press\">250 students</a>. The national average is <a href=\"https://www.nacacnet.org/news--publications/Research/state-by-state-student-to-counselor-ratio-report2/\">482 students</a> per counselor. Counselors can be critical for guiding <a href=\"https://hechingerreport.org/what-do-philadelphias-students-want-more-college-counseling/\">students through the application process</a>.",
    expanded_text_right_succeed: "<strong>You decide to tackle your college applications on your own.</strong> The American School Counselor Association recommends that a school counselor’s caseload be limited to <a href=\"https://www.schoolcounselor.org/press\">250 students</a>. The national average is <a href=\"https://www.nacacnet.org/news--publications/Research/state-by-state-student-to-counselor-ratio-report2/\">482 students</a> per counselor. Counselors can be critical for guiding <a href=\"https://hechingerreport.org/what-do-philadelphias-students-want-more-college-counseling/\">students through the application process</a>.",
  },
  {
    prompt_id: "prompt_one",
    prompt_condition: "private",
    initial_text: "There are four counselors for 800 students at your school. It would be great to get advice on how to write a strong personal essay or obtain letters of recommendation. Do you...",
    expanded_text_left_succeed: "<strong>You get a time slot after school and get tips on polishing your personal statement.</strong> The American School Counselor Association recommends that a school counselor’s caseload be limited to <a href=\"https://www.schoolcounselor.org/press\">250 students</a>. The national average is <a href=\"https://www.nacacnet.org/news--publications/Research/state-by-state-student-to-counselor-ratio-report2/\">482 students</a> per counselor. Counselors can be critical for guiding <a href=\"https://hechingerreport.org/what-do-philadelphias-students-want-more-college-counseling/\">students through the application process</a>.",
    expanded_text_right_succeed: "<strong>You decide to tackle your college applications on your own.</strong> The American School Counselor Association recommends that a school counselor’s caseload be limited to <a href=\"https://www.schoolcounselor.org/press\">250 students</a>. The national average is <a href=\"https://www.nacacnet.org/news--publications/Research/state-by-state-student-to-counselor-ratio-report2/\">482 students</a> per counselor. Counselors can be critical for guiding <a href=\"https://hechingerreport.org/what-do-philadelphias-students-want-more-college-counseling/\">students through the application process</a>.",
  },
  {
    prompt_id: "prompt_two",
    prompt_condition: "all",
    initial_text: "</strong>You’re thinking about taking a college-level course your senior year, but you’re already signed up for an honors biology course and will participate in soccer and drama club. Do you…",
    expanded_text_left_succeed: "<strong>You have to skip some games, but you enroll in AP Chemistry, a favorite subject.</strong> Placing students in difficult high school classes, such as Advanced Placement courses, may <a href=\"https://hechingerreport.org/placing-students-difficult-high-school-classes-may-increase-college-enrollment/\">increase college enrollment</a>. Some states, such as Mississippi, Colorado and Illinois, are <a href=\"https://hechingerreport.org/can-online-learning-level-ap-playing-field-rural-kids/\">using online platforms and video conferencing</a> to bring AP classes to rural students.",
    expanded_text_right_succeed: "<strong>You choose to keep your class schedule light since you heard extracurriculars are important for college applications.</strong> Placing students in difficult high school classes, such as Advanced Placement courses, may <a href=\"https://hechingerreport.org/placing-students-difficult-high-school-classes-may-increase-college-enrollment/\">increase college enrollment</a>. Some states, such as Mississippi, Colorado and Illinois, are <a href=\"https://hechingerreport.org/can-online-learning-level-ap-playing-field-rural-kids/\">using online platforms and video conferencing</a> to bring AP classes to rural students.",
  },
  {
    prompt_id: "prompt_three",
    prompt_condition: "low_income",
    initial_text: "</strong>Many colleges require you to submit SAT or ACT scores, but your test scores could use a boost. Do you...",
    expanded_text_left_succeed: "<strong>You take the prep course and improve your scores. </strong>Wealthy families often pay for expensive test preparation. Some even pay to have <a href=\"https://games-cdn.washingtonpost.com/notes/prod/default/documents/d216435e-e073-41f6-b6fa-33ed835d053d/note/1310d5d4-ef15-4ea9-ad35-5edaac10cbb5.pdf#page=1\">a skilled test-taker illegally complete the exam for their child</a>. African Americans, Latinos and other underrepresented minorities, as well as students from low-income backgrounds, <a href=\"https://reports.collegeboard.org/pdf/2018-total-group-sat-suite-assessments-annual-report.pdf\">often score below their peers on the SAT</a>. A growing number of colleges and universities are becoming <a href=\"https://hechingerreport.org/the-new-sat-lands-just-as-more-colleges-go-test-optional/\">test optional</a>.",
    expanded_text_left_fail: "<strong>You sign up for the prep course, but the teacher does not seem prepared. It does not improve your score.</strong> Wealthy families often pay for expensive test preparation. Some even pay to have <a href=\"https://games-cdn.washingtonpost.com/notes/prod/default/documents/d216435e-e073-41f6-b6fa-33ed835d053d/note/1310d5d4-ef15-4ea9-ad35-5edaac10cbb5.pdf#page=1\">a skilled test-taker illegally complete the exam for their child</a>. African Americans, Latinos and other underrepresented minorities, as well as students from low-income backgrounds, <a href=\"https://reports.collegeboard.org/pdf/2018-total-group-sat-suite-assessments-annual-report.pdf\">often score below their peers on the SAT</a>. A growing number of colleges and universities are becoming <a href=\"https://hechingerreport.org/the-new-sat-lands-just-as-more-colleges-go-test-optional/\">test optional</a>.",
    expanded_text_right_succeed: "<strong>You decide to skip the prep. Extracurriculars are more important. </strong>Wealthy families often pay for expensive test preparation. Some even pay to have <a href=\"https://games-cdn.washingtonpost.com/notes/prod/default/documents/d216435e-e073-41f6-b6fa-33ed835d053d/note/1310d5d4-ef15-4ea9-ad35-5edaac10cbb5.pdf#page=1\">a skilled test-taker illegally complete the exam for their child</a>. African Americans, Latinos and other underrepresented minorities, as well as students from low-income backgrounds, <a href=\"https://reports.collegeboard.org/pdf/2018-total-group-sat-suite-assessments-annual-report.pdf\">often score below their peers on the SAT</a>. A growing number of colleges and universities are becoming <a href=\"https://hechingerreport.org/the-new-sat-lands-just-as-more-colleges-go-test-optional/\">test optional</a>.",
  },
  {
    prompt_id: "prompt_three",
    prompt_condition: "high_income",
    initial_text: "</strong>Many colleges require you to submit SAT or ACT scores, but your test scores could use a boost. Do you...",
    expanded_text_left_succeed: "<strong>Your parents enroll you in a prep course and you improve your scores.</strong> Wealthy families often pay for expensive test preparation. Some even pay to have <a href=\"https://games-cdn.washingtonpost.com/notes/prod/default/documents/d216435e-e073-41f6-b6fa-33ed835d053d/note/1310d5d4-ef15-4ea9-ad35-5edaac10cbb5.pdf#page=1\">a skilled test-taker illegally complete the exam for their child</a>. African Americans, Latinos and other underrepresented minorities, as well as students from low-income backgrounds, <a href=\"https://reports.collegeboard.org/pdf/2018-total-group-sat-suite-assessments-annual-report.pdf\">often score below their peers on the SAT</a>. A growing number of colleges and universities are becoming <a href=\"https://hechingerreport.org/the-new-sat-lands-just-as-more-colleges-go-test-optional/\">test optional</a>.",
    expanded_text_right_succeed: "<strong>You decide to skip the prep. Extracurriculars are more important. </strong>Wealthy families often pay for expensive test preparation. Some even pay to have <a href=\"https://games-cdn.washingtonpost.com/notes/prod/default/documents/d216435e-e073-41f6-b6fa-33ed835d053d/note/1310d5d4-ef15-4ea9-ad35-5edaac10cbb5.pdf#page=1\">a skilled test-taker illegally complete the exam for their child</a>. African Americans, Latinos and other underrepresented minorities, as well as students from low-income backgrounds, <a href=\"https://reports.collegeboard.org/pdf/2018-total-group-sat-suite-assessments-annual-report.pdf\">often score below their peers on the SAT</a>. A growing number of colleges and universities are becoming <a href=\"https://hechingerreport.org/the-new-sat-lands-just-as-more-colleges-go-test-optional/\">test optional</a>.",
  },
  {
    prompt_id: "prompt_four",
    prompt_condition: "low_income",
    initial_text: "Tuition and fees at your dream school are $40,000 per year. Filling out the Free Application for Federal Student Aid, or FAFSA, will help you apply for financial aid. But the FAFSA has 108 questions and asks for information about household income and taxes. Do you...",
    expanded_text_left_succeed: "<strong>You complete the FAFSA and qualify for some grant money. </strong>Almost 40 percent of the class of 2018 <a href=\"https://hechingerreport.org/are-too-few-college-students-asking-for-federal-aid/\">failed to complete FAFSA</a>. <a href=\"https://tuitiontracker.org/\">TuitionTracker</a> can help students estimate the actual net price they’ll pay based on family income. On average, public schools charge full-time, in-state students $10,230 in tuition and fees. At private universities the average cost is $35,830.",
    expanded_text_right_succeed: "<strong>You’ll have to figure out how to pay for college without federal grants or loans. </strong>Almost 40 percent of the class of 2018 <a href=\"https://hechingerreport.org/are-too-few-college-students-asking-for-federal-aid/\">failed to complete FAFSA</a>. <a href=\"https://tuitiontracker.org/\">TuitionTracker</a> can help students estimate the actual net price they’ll pay based on family income. On average, public schools charge full-time, in-state students $10,230 in tuition and fees. At private universities the average cost is $35,830.",
  },
  {
    prompt_id: "prompt_four",
    prompt_condition: "high_income",
    initial_text: "Tuition and fees at your dream school are $40,000 per year. Filling out the Free Application for Federal Student Aid, or FAFSA, will help you apply for financial aid. But the FAFSA has 108 questions and asks for information about household income and taxes.",
    expanded_text_left_succeed: "<strong>You complete the FAFSA but don’t qualify for grant money. Oh well. </strong>Almost 40 percent of the class of 2018 <a href=\"https://hechingerreport.org/are-too-few-college-students-asking-for-federal-aid/\">failed to complete the FAFSA</a>. <a href=\"https://tuitiontracker.org/\">TuitionTracker</a> can help students estimate the actual net price they’ll pay based on family income. On average, public schools charge full-time, in-state students $10,230 in tuition and fees. At private universities the average cost is $35,830.",
    expanded_text_right_succeed: "<strong>Your family has a college fund to cover your costs. </strong>Almost 40 percent of the class of 2018 <a href=\"https://hechingerreport.org/are-too-few-college-students-asking-for-federal-aid/\">failed to complete the FAFSA</a>. <a href=\"https://tuitiontracker.org/\">TuitionTracker</a> can help students estimate the actual net price they’ll pay based on family income. On average, public schools charge full-time, in-state students $10,230 in tuition and fees. At private universities the average cost is $35,830.",
  },
  {
    prompt_id: "prompt_five",
    prompt_condition: "all",
    initial_text: "Are you a DACA recipient?",
    expanded_text_left_succeed: "<strong>Students who are under the Deferred Action for Childhood Arrivals status, or DACA, can have a much harder time paying for school than citizens.</strong> Twenty-six states require in-state DACA students to pay higher out-of-state tuition at public universities and colleges. Organizations such as TheDream.Us offer scholarships to non-citizen students. <a href=\"https://hechingerreport.org/daca-students-persevere-enrolling-at-remaining-in-and-graduating-from-college/\">The retention rate for DACA students in college</a> is higher than for students with citizenship status.",
    expanded_text_right_succeed: "<strong>Students who are under the Deferred Action for Childhood Arrivals status, or DACA, can have a much harder time paying for school than citizens.</strong> Twenty-six states require in-state DACA students to pay higher out-of-state tuition at public universities and colleges. Organizations such as TheDream.Us offer scholarships to non-citizen students. <a href=\"https://hechingerreport.org/daca-students-persevere-enrolling-at-remaining-in-and-graduating-from-college/\">The retention rate for DACA students in college</a> is higher than for students with citizenship status.",
  },
  {
    prompt_id: "prompt_six",
    prompt_condition: "low_income",
    initial_text: "Paying for college could be a lot easier with a scholarship, but applying requires submitting several essays, and sometimes videos, which can take hours to put together. Do you...",
    expanded_text_left_succeed: "<strong>You get a small scholarship that you can add to the grant you received if you filled out the FAFSA. </strong>The <a href=\"https://trends.collegeboard.org/student-aid/figures-tables/average-aid-student-over-time-postsecondary-undergraduate-graduate\">average aid</a> for full-time undergraduate students in 2015-2016 was $14,696. But the <a href=\"https://nces.ed.gov/fastfacts/display.asp?id=76\">average cost</a> for tuition, fees, room and board at public colleges and universities was $16,757 and at private nonprofits it was $43,065. Federal aid hasn’t kept up with <a href=\"https://hechingerreport.org/bending-to-the-law-of-supply-and-demand-some-colleges-are-dropping-their-prices/\">college costs</a> and often comes nowhere near being enough to cover living expenses.",
    expanded_text_right_succeed: "<strong>You skip the scholarship application process. </strong>The <a href=\"https://trends.collegeboard.org/student-aid/figures-tables/average-aid-student-over-time-postsecondary-undergraduate-graduate\">average aid</a> for full-time undergraduate students in 2015-2016 was $14,696. But the <a href=\"https://nces.ed.gov/fastfacts/display.asp?id=76\">average cost</a> for tuition, fees, room and board at public colleges and universities was $16,757 and at private nonprofits it was $43,065. Federal aid hasn’t kept up with <a href=\"https://hechingerreport.org/bending-to-the-law-of-supply-and-demand-some-colleges-are-dropping-their-prices/\">college costs</a> and often comes nowhere near being enough to cover living expenses.",
  },
  {
    prompt_id: "prompt_six",
    prompt_condition: "high_income",
    initial_text: "Paying for college could be a lot easier with a scholarship, but applying requires submitting several essays, and sometimes videos, which can take hours to put together. Do you...",
    expanded_text_left_succeed: "<strong>You get a sizeable scholarship from the school you applied to. </strong>The <a href=\"https://trends.collegeboard.org/student-aid/figures-tables/average-aid-student-over-time-postsecondary-undergraduate-graduate\">average aid</a> for full-time undergraduate students in 2015-2016 was $14,696. But the <a href=\"https://nces.ed.gov/fastfacts/display.asp?id=76\">average cost</a> for tuition, fees, room and board at public colleges and universities was $16,757 and at private nonprofits it was $43,065. Federal aid hasn’t kept up with <a href=\"https://hechingerreport.org/bending-to-the-law-of-supply-and-demand-some-colleges-are-dropping-their-prices/\">college costs</a> and often comes nowhere near being enough to cover living expenses.",
    expanded_text_right_succeed: "<strong>You skip the scholarship application process. </strong>The <a href=\"https://trends.collegeboard.org/student-aid/figures-tables/average-aid-student-over-time-postsecondary-undergraduate-graduate\">average aid</a> for full-time undergraduate students in 2015-2016 was $14,696. But the <a href=\"https://nces.ed.gov/fastfacts/display.asp?id=76\">average cost</a> for tuition, fees, room and board at public colleges and universities was $16,757 and at private nonprofits it was $43,065. Federal aid hasn’t kept up with <a href=\"https://hechingerreport.org/bending-to-the-law-of-supply-and-demand-some-colleges-are-dropping-their-prices/\">college costs</a> and often comes nowhere near being enough to cover living expenses.",
  },
  {
    prompt_id: "prompt_seven",
    prompt_condition: "low_income",
    initial_text: "You’re on a tight budget for things like going to the movies or to dinner with friends. An extra $250 a month would be ideal. Do you...",
    expanded_text_left_succeed: "<strong>You decline invitations from your new friends to go out, worried that you can’t add to your busy schedule by taking a job.</strong> <a href=\"http://equityinlearning.act.org/wp-content/uploads/2017/08/WhoDoesWorkWorkFor.pdf\">Students who work more than 15 hours a week are more likely to drop out</a>. Low-income students can consider going to schools that offer <a href=\"https://hechingerreport.org/colleges-offer-microgrants-to-help-low-income-students-pay-bills-that-can-derail-them/\">micro grants</a> to reduce college costs. One school is starting <a href=\"https://hechingerreport.org/can-work-colleges-in-cities-become-a-low-cost-high-value-model-for-the-future/\">a network of urban work colleges</a> to help students better balance working and learning.",
    expanded_text_right_succeed: "<strong>You spend some of your free time working at a restaurant near campus.</strong> <a href=\"http://equityinlearning.act.org/wp-content/uploads/2017/08/WhoDoesWorkWorkFor.pdf\">Students who work more than 15 hours a week are more likely to drop out</a>. Low-income students can consider going to schools that offer <a href=\"https://hechingerreport.org/colleges-offer-microgrants-to-help-low-income-students-pay-bills-that-can-derail-them/\">micro grants</a> to reduce college costs. One school is starting <a href=\"https://hechingerreport.org/can-work-colleges-in-cities-become-a-low-cost-high-value-model-for-the-future/\">a network of urban work colleges</a> to help students better balance working and learning.",
  },
  {
    prompt_id: "prompt_seven",
    prompt_condition: "high_income",
    initial_text: "You’re lucky your family can help pay for some of the expenses that come up in college, from books to an occasional dinner out with friends. Since you don’t have to juggle a job, you can concentrate on studying. <a href=\"http://equityinlearning.act.org/wp-content/uploads/2017/08/WhoDoesWorkWorkFor.pdf\"> Students who work more than 15 hours a week are more likely to drop out</a>.",
  },
  {
    prompt_id: "prompt_eight",
    prompt_condition: "all",
    initial_text: "It’s time to sign up for classes. You loved chemistry and biology, but you didn’t do well in English class. Do you study before taking the reading and writing placement exams?",
    expanded_text_left_succeed: "<strong>You pass the reading and writing tests and can register for a college-level course. </strong>Many students who enroll in <a href=\"https://mailchi.mp/hechingerreport.org/massachusetts-pushes-to-get-more-students-out-of-remedial-classes?e=bb1b394039\">remedial classes</a> don’t complete a college-level course within two years. At schools that offer <a href=\"https://hechingerreport.org/help-students-avoid-remedial-ed-trap/\">corequisite courses</a>, students can take a standard college class while getting additional academic support.",
    expanded_text_left_fail: "<strong>You don’t score high enough on the exam and must enroll in a remedial class. </strong>Many students who enroll in <a href=\"https://mailchi.mp/hechingerreport.org/massachusetts-pushes-to-get-more-students-out-of-remedial-classes?e=bb1b394039\">remedial classes</a> don’t complete a college-level course within two years. At schools that offer <a href=\"https://hechingerreport.org/help-students-avoid-remedial-ed-trap/\">corequisite courses</a>, students can take a standard college class while getting additional academic support.",
    expanded_text_right_succeed: "<strong>You don’t score high enough on the exam and must enroll in a remedial class. </strong>Many students who enroll in <a href=\"https://mailchi.mp/hechingerreport.org/massachusetts-pushes-to-get-more-students-out-of-remedial-classes?e=bb1b394039\">remedial classes</a> don’t complete a college-level course within two years. At schools that offer <a href=\"https://hechingerreport.org/help-students-avoid-remedial-ed-trap/\">corequisite courses</a>, students can take a standard college class while getting additional academic support.",
  },
  {
    prompt_id: "prompt_nine",
    prompt_condition: "all",
    initial_text: "You’re interested in biology, but also loved an environmental chemistry class. Do you...",
    expanded_text_left_succeed: "<strong>You choose to major in chemistry before sophomore year ends. </strong>Nearly 6 in 10 students don’t graduate in four years, and for many it’s because they can’t decide on a major. Extended time in school can mean paying more tuition and fees or taking out more loans. Some colleges have programs to help students <a href=\"https://hechingerreport.org/switching-majors-is-adding-time-and-tuition-to-the-already-high-cost-of-college/\">figure out what they want to learn</a> and <a href=\"https://hechingerreport.org/embattled-colleges-focus-on-an-obvious-fix-helping-students-graduate-on-time/\">make sure they take required classes as soon as possible</a>.",
    expanded_text_right_succeed: "<strong>You wait until your junior year to settle on chemistry, and now you’re behind in credits in your major. </strong>Nearly 6 in 10 students don’t graduate in four years, and for many it’s because they can’t decide on a major. Extended time in school can mean paying more tuition and fees or taking out more loans. Some colleges have programs to help students <a href=\"https://hechingerreport.org/switching-majors-is-adding-time-and-tuition-to-the-already-high-cost-of-college/\">figure out what they want to learn</a> and <a href=\"https://hechingerreport.org/embattled-colleges-focus-on-an-obvious-fix-helping-students-graduate-on-time/\">make sure they take required classes as soon as possible</a>. ",
  },
  {
    prompt_id: "prompt_ten",
    prompt_condition: "all",
    initial_text: "After speaking with your environmental chemistry professor, you’re wishing you could major in this subject. But it turns out your college doesn’t offer environmental chemistry as a major. Do you...",
    expanded_text_left_succeed: "<strong>You transfer to a school that has an environmental chemistry major with a solid reputation. </strong>Thirty percent of students transfer at least once in their college career. Transfer students lose more than 40 percent of the credits they’ve earned and paid for, on average. Several states and colleges are <a href=\"https://hechingerreport.org/transfer-students-start-getting-more-of-the-credits-theyve-already-earned/\">changing their policies</a> to be more accommodating to transfer students.",
    expanded_text_right_succeed: "<strong>You stick with your chemistry major to stay at your college. </strong>Thirty percent of students transfer at least once in their college career. Transfer students lose more than 40 percent of the credits they’ve earned and paid for, on average. Several states and colleges are <a href=\"https://hechingerreport.org/transfer-students-start-getting-more-of-the-credits-theyve-already-earned/\">changing their policies</a> to be more accommodating to transfer students.",
  },
  {
    prompt_id: "prompt_eleven",
    prompt_condition: "all",
    initial_text: "It’s your last year in college! You want some work experience that’s in line with your major, but you’re also taking 18 credits. Do you…",
    expanded_text_left_succeed: "<strong>You take an internship that you hope will get you a job after college.</strong> Students who graduate with internships are <a href=\"https://www.naceweb.org/job-market/internships/the-positive-implications-of-internships-on-early-career-outcomes/\">more likely to obtain full-time employment once they graduate</a>, according to the National Association of Colleges and Employers. Some colleges are <a href=\"https://hechingerreport.org/colleges-welcome-first-year-students-by-getting-them-thinking-about-jobs/\">beefing up career advising</a> before students have even settled into freshman year.",
    expanded_text_right_succeed: "<strong>You decide to focus on your classes and hope your grades will help you get noticed by employers. </strong>Students who graduate with internships are <a href=\"https://www.naceweb.org/job-market/internships/the-positive-implications-of-internships-on-early-career-outcomes/\">more likely to obtain full-time employment once they graduate</a>, according to the National Association of Colleges and Employers. Some colleges are <a href=\"https://hechingerreport.org/colleges-welcome-first-year-students-by-getting-them-thinking-about-jobs/\">beefing up career advising</a> before students have even settled into freshman year.",
  },
];

const options = [
  {
    prompt_id: "prompt_one",
    prompt_condition: "public",
    button_option: "left",
    button_text: "Wait to meet with one",
    next_prompt_id: "prompt_two",
    score: 2,
    chance: 0.5,
    chance_score: 1,
  },
  {
    prompt_id: "prompt_one",
    prompt_condition: "public",
    button_option: "right",
    button_text: "Use that time to study",
    next_prompt_id: "prompt_two",
    score: 1,
  },
  {
    prompt_id: "prompt_one",
    prompt_condition: "private",
    button_option: "left",
    button_text: "Wait to meet with one",
    next_prompt_id: "prompt_two",
    score: 2,
  },
  {
    prompt_id: "prompt_one",
    prompt_condition: "private",
    button_option: "right",
    button_text: "Use that time to study",
    next_prompt_id: "prompt_two",
    score: 1,
  },
  {
    prompt_id: "prompt_two",
    prompt_condition: "all",
    button_option: "left",
    button_text: "Sign up for AP Chemistry",
    next_prompt_id: "prompt_three",
    score: 2,
  },
  {
    prompt_id: "prompt_two",
    prompt_condition: "all",
    button_option: "right",
    button_text: "Stick to your schedule",
    next_prompt_id: "prompt_three",
    score: 1,
  },
  {
    prompt_id: "prompt_three",
    prompt_condition: "low_income",
    button_option: "left",
    button_text: "Take your school’s test prep course",
    next_prompt_id: "prompt_four",
    score: 2,
    chance: 0.25,
    chance_score: 1,
  },
  {
    prompt_id: "prompt_three",
    prompt_condition: "low_income",
    button_option: "right",
    button_text: "Skip it for drama club",
    next_prompt_id: "prompt_four",
    score: 1,
  },
  {
    prompt_id: "prompt_three",
    prompt_condition: "high_income",
    button_option: "left",
    button_text: "Take your school’s test prep course",
    next_prompt_id: "prompt_four",
    score: 2,
  },
  {
    prompt_id: "prompt_three",
    prompt_condition: "high_income",
    button_option: "right",
    button_text: "Skip it for drama club",
    next_prompt_id: "prompt_four",
    score: 1,
  },
  {
    prompt_id: "prompt_four",
    prompt_condition: "low_income",
    button_option: "left",
    button_text: "Complete it",
    next_prompt_id: "prompt_five",
    score: 2,
  },
  {
    prompt_id: "prompt_four",
    prompt_condition: "low_income",
    button_option: "right",
    button_text: "Don’t complete it",
    next_prompt_id: "prompt_five",
    score: 1,
  },
  {
    prompt_id: "prompt_four",
    prompt_condition: "high_income",
    button_option: "left",
    button_text: "Complete it",
    next_prompt_id: "prompt_five",
    score: 2,
  },
  {
    prompt_id: "prompt_four",
    prompt_condition: "high_income",
    button_option: "right",
    button_text: "Don’t complete it",
    next_prompt_id: "prompt_five",
    score: 3,
  },
  {
    prompt_id: "prompt_five",
    prompt_condition: "all",
    button_option: "left",
    button_text: "Yes",
    next_prompt_id: "prompt_six",
    score: 2,
  },
  {
    prompt_id: "prompt_five",
    prompt_condition: "all",
    button_option: "right",
    button_text: "No",
    next_prompt_id: "prompt_six",
    score: 1,
  },
  {
    prompt_id: "prompt_six",
    prompt_condition: "low_income",
    button_option: "left",
    button_text: "Apply for one",
    next_prompt_id: "prompt_seven",
    score: 2,
  },
  {
    prompt_id: "prompt_six",
    prompt_condition: "low_income",
    button_option: "right",
    button_text: "Find other ways to get money",
    next_prompt_id: "prompt_seven",
    score: 1,
  },
  {
    prompt_id: "prompt_six",
    prompt_condition: "high_income",
    button_option: "left",
    button_text: "Apply for one",
    next_prompt_id: "prompt_seven",
    score: 3,
  },
  {
    prompt_id: "prompt_six",
    prompt_condition: "high_income",
    button_option: "right",
    button_text: "Find other ways to get money",
    next_prompt_id: "prompt_seven",
    score: 1,
  },
  {
    prompt_id: "prompt_seven",
    prompt_condition: "low_income",
    button_option: "left",
    button_text: "Cut back your social life",
    next_prompt_id: "prompt_eight",
    score: 1,
  },
  {
    prompt_id: "prompt_seven",
    prompt_condition: "low_income",
    button_option: "right",
    button_text: "Get a job while in school",
    next_prompt_id: "prompt_eight",
    score: 2,
  },
  {
    prompt_id: "prompt_seven",
    prompt_condition: "high_income",
    button_option: "left",
    button_text: "Continue",
    next_prompt_id: "prompt_eight",
    score: 4,
  },
  {
    prompt_id: "prompt_seven",
    prompt_condition: "high_income",
    button_option: "right",
    button_text: "Continue",
    next_prompt_id: "prompt_eight",
    score: 4,
  },
  {
    prompt_id: "prompt_eight",
    prompt_condition: "all",
    button_option: "left",
    button_text: "You take a practice test",
    next_prompt_id: "prompt_nine",
    score: 3,
    chance: 0.25,
    chance_score: 1,
  },
  {
    prompt_id: "prompt_eight",
    prompt_condition: "all",
    button_option: "right",
    button_text: "You’re too busy",
    next_prompt_id: "prompt_nine",
    score: 1,
  },
  {
    prompt_id: "prompt_nine",
    prompt_condition: "all",
    button_option: "left",
    button_text: "Choose your major sophomore year",
    next_prompt_id: "prompt_ten",
    score: 2,
  },
  {
    prompt_id: "prompt_nine",
    prompt_condition: "all",
    button_option: "right",
    button_text: "Wait to be sure until after sophomore year",
    next_prompt_id: "prompt_ten",
    score: 1,
  },
  {
    prompt_id: "prompt_ten",
    prompt_condition: "all",
    button_option: "left",
    button_text: "Transfer",
    next_prompt_id: "prompt_eleven",
    score: 1,
  },
  {
    prompt_id: "prompt_ten",
    prompt_condition: "all",
    button_option: "right",
    button_text: "Stick with your original choice",
    next_prompt_id: "prompt_eleven",
    score: 2,
  },
  {
    prompt_id: "prompt_eleven",
    prompt_condition: "all",
    button_option: "left",
    button_text: "Take an internship",
    next_prompt_id: "end_screen",
    score: 2,
  },
  {
    prompt_id: "prompt_eleven",
    prompt_condition: "all",
    button_option: "right",
    button_text: "Focus on your studies",
    next_prompt_id: "end_screen",
    score: 1,
  },
];

const optionsById = groupBy(options, "prompt_id");
const fullPrompts = prompts.map((prompt) => {
  const opts = optionsById[prompt.prompt_id];
  return {
    ...prompt,
    options: {
      left: opts.find((opt) => opt.button_option === "left")!,
      right: opts.find((opt) => opt.button_option === "right")!,
    },
  };
});

export default fullPrompts as PromptType[];
