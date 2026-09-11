/* =========================================================================
   CSIR-NET MATHEMATICAL SCIENCES — MOCK TEST ENGINE
   Pure vanilla JS. All state persisted to localStorage under key CSIR_STATE.
   ========================================================================= */

/* ---------------------- 1. CENTRALIZED MARKING RULES -------------------- */
const MARKING_RULES = {
  A: { label: "Part A", available: 18, maxAttempt: 15, correctMarks: 2,   negativeMarks: 0.5 },
  B: { label: "Part B", available: 26, maxAttempt: 25, correctMarks: 3,   negativeMarks: 0.75 },
  C: { label: "Part C", available: 22, maxAttempt: 20, correctMarks: 4,   negativeMarks: 0 } // Part C: full marks only if selection exactly matches; no negative marking (standard CSIR-NET MSQ rule)
};
const TOTAL_DURATION_MIN = 180;
const TOTAL_MAX_ATTEMPT = MARKING_RULES.A.maxAttempt + MARKING_RULES.B.maxAttempt + MARKING_RULES.C.maxAttempt; // 60

/* ---------------------- 2. QUESTION BANK --------------------------------
   Only Mock Test 1 is populated with real, hand-verified questions.
   Mocks 2-5 are intentionally left out of MOCK_TESTS (available:false on
   the dashboard) rather than filled with placeholder/fake content — see
   README.md for why, and how to extend this array.
   -------------------------------------------------------------------- */

const MOCK1_PART_A = [
{id:"M1-A-01",section:"A",topic:"Quantitative Reasoning",subtopic:"Number Series",difficulty:"Moderate",
 question:"Find the next term in the series: 2, 5, 10, 17, 26, ?",
 options:{A:"35",B:"36",C:"37",D:"38"}, correctAnswer:"C",
 explanation:"The n-th term is n²+1: 1+1=2, 4+1=5, 9+1=10, 16+1=17, 25+1=26, and the next term is 36+1=37."},
{id:"M1-A-02",section:"A",topic:"Ratios",subtopic:"Compound Ratio",difficulty:"Moderate",
 question:"If A:B = 3:4 and B:C = 5:6, find A:B:C.",
 options:{A:"15:20:24",B:"3:4:6",C:"9:12:18",D:"6:8:9"}, correctAnswer:"A",
 explanation:"Make B equal in both ratios: A:B=3:4=15:20, B:C=5:6=20:24. Combining, A:B:C=15:20:24."},
{id:"M1-A-03",section:"A",topic:"Percentages",subtopic:"Successive Change",difficulty:"Easy",
 question:"The price of an item is increased by 20% and then decreased by 20%. What is the net percentage change?",
 options:{A:"No change",B:"4% increase",C:"4% decrease",D:"2% decrease"}, correctAnswer:"C",
 explanation:"Net change = x + y + xy/100 with x=20, y=-20: 20-20+(20)(-20)/100 = -4, i.e. a 4% decrease."},
{id:"M1-A-04",section:"A",topic:"Averages",subtopic:"Replacement",difficulty:"Easy",
 question:"The average of 5 numbers is 20. If one number, 30, is replaced by 50, what is the new average?",
 options:{A:"22",B:"24",C:"26",D:"28"}, correctAnswer:"B",
 explanation:"Original sum = 5×20 = 100. New sum = 100 − 30 + 50 = 120. New average = 120/5 = 24."},
{id:"M1-A-05",section:"A",topic:"Probability",subtopic:"Two Dice",difficulty:"Moderate",
 question:"Two fair dice are rolled. What is the probability that the sum of the numbers shown is 7?",
 options:{A:"1/6",B:"1/12",C:"5/36",D:"1/9"}, correctAnswer:"A",
 explanation:"Favourable outcomes for sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) — 6 outcomes out of 36. Probability = 6/36 = 1/6."},
{id:"M1-A-06",section:"A",topic:"Permutations & Combinations",subtopic:"Arrangements with Repetition",difficulty:"Moderate",
 question:"In how many distinct ways can the letters of the word LEVEL be arranged?",
 options:{A:"120",B:"60",C:"30",D:"15"}, correctAnswer:"C",
 explanation:"LEVEL has 5 letters with L repeated twice and E repeated twice: 5!/(2!·2!) = 120/4 = 30."},
{id:"M1-A-07",section:"A",topic:"Data Interpretation",subtopic:"Weighted Percentage",difficulty:"Moderate",
 question:"In a class, 60% of the students are boys and the rest are girls. 30% of the boys and 40% of the girls play cricket. What percentage of the total students play cricket?",
 options:{A:"30%",B:"32%",C:"34%",D:"36%"}, correctAnswer:"C",
 explanation:"Boys contribute 0.60×0.30=0.18 of the class; girls contribute 0.40×0.40=0.16. Total = 0.18+0.16 = 0.34 = 34%."},
{id:"M1-A-08",section:"A",topic:"Logical Reasoning",subtopic:"Syllogism",difficulty:"Moderate",
 question:"Given: (1) All A are B. (2) All B are C. Which conclusion necessarily follows?",
 options:{A:"All A are C",B:"All C are A",C:"Some A are not C",D:"No relation between A and C can be determined"}, correctAnswer:"A",
 explanation:"Since every A is a B and every B is a C, transitivity of 'all...are' gives: every A is a C."},
{id:"M1-A-09",section:"A",topic:"Logical Reasoning",subtopic:"Blood Relations",difficulty:"Moderate",
 question:"Pointing to a photograph, a man says, 'She is the daughter of my grandfather's only son.' Assuming the woman in the photograph is not the man himself, how is she related to him?",
 options:{A:"Mother",B:"Sister",C:"Daughter",D:"Cousin"}, correctAnswer:"B",
 explanation:"'My grandfather's only son' is the man's father (since it's the only son of the grandfather). The daughter of the man's father, other than the man himself, is his sister."},
{id:"M1-A-10",section:"A",topic:"Number Theory (Aptitude)",subtopic:"Prime Identification",difficulty:"Easy",
 question:"Find the odd one out: 3, 5, 7, 11, 15, 17",
 options:{A:"7",B:"11",C:"15",D:"17"}, correctAnswer:"C",
 explanation:"All the others (3,5,7,11,17) are prime; 15 = 3×5 is composite, so it is the odd one out."},
{id:"M1-A-11",section:"A",topic:"Spatial/Clock Reasoning",subtopic:"Clock Angles",difficulty:"Hard",
 question:"What is the angle (in degrees, taking the smaller angle) between the hour and minute hands of a clock at 3:40?",
 options:{A:"120°",B:"130°",C:"140°",D:"150°"}, correctAnswer:"B",
 explanation:"Angle = |30H − 5.5M| = |30(3) − 5.5(40)| = |90 − 220| = 130. Since 130 ≤ 180, this is already the smaller angle."},
{id:"M1-A-12",section:"A",topic:"Quantitative Reasoning",subtopic:"Speed-Distance-Time",difficulty:"Easy",
 question:"A train 120 m long crosses a pole in 8 seconds. What is its speed in km/h?",
 options:{A:"45",B:"48",C:"54",D:"60"}, correctAnswer:"C",
 explanation:"Speed = 120 m / 8 s = 15 m/s. Converting: 15 × 18/5 = 54 km/h."},
{id:"M1-A-13",section:"A",topic:"Quantitative Reasoning",subtopic:"Time and Work",difficulty:"Moderate",
 question:"A can complete a job in 10 days and B can complete it in 15 days. Working together, how many days will they take?",
 options:{A:"5",B:"6",C:"7",D:"8"}, correctAnswer:"B",
 explanation:"Combined rate = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6 of the job per day, so together they take 6 days."},
{id:"M1-A-14",section:"A",topic:"Mathematical Reasoning",subtopic:"Set Theory",difficulty:"Moderate",
 question:"In a survey, |A∪B| = 50, |A| = 30, |B| = 25, where A and B are sets of respondents with two properties. Find |A∩B|.",
 options:{A:"5",B:"10",C:"15",D:"20"}, correctAnswer:"A",
 explanation:"By inclusion-exclusion, |A∩B| = |A|+|B|−|A∪B| = 30+25−50 = 5."},
{id:"M1-A-15",section:"A",topic:"Permutations & Combinations",subtopic:"Committee Selection",difficulty:"Hard",
 question:"From a group of 7 people, a committee of 3 is to be chosen. In how many ways can this be done so that a particular person X is always included?",
 options:{A:"15",B:"20",C:"25",D:"35"}, correctAnswer:"A",
 explanation:"If X is fixed in the committee, we choose the remaining 2 members from the other 6 people: C(6,2) = 15."},
{id:"M1-A-16",section:"A",topic:"Spatial Reasoning",subtopic:"Cube Painting",difficulty:"Hard",
 question:"A cube is painted red on all its faces and then cut into 27 identical smaller cubes (3×3×3). How many of the small cubes have exactly 2 painted faces?",
 options:{A:"8",B:"12",C:"6",D:"24"}, correctAnswer:"B",
 explanation:"In a 3×3×3 cube, cubes with exactly 2 painted faces lie on the edges (excluding corners); there are 12 edges, each contributing exactly one such cube, giving 12."},
{id:"M1-A-17",section:"A",topic:"Number Theory (Aptitude)",subtopic:"Remainders",difficulty:"Hard",
 question:"What is the remainder when 7¹⁰⁰ is divided by 5?",
 options:{A:"1",B:"2",C:"3",D:"4"}, correctAnswer:"A",
 explanation:"7 ≡ 2 (mod 5), and powers of 2 mod 5 cycle as 2,4,3,1 with period 4. Since 100 is a multiple of 4, 2¹⁰⁰ ≡ 1 (mod 5)."},
{id:"M1-A-18",section:"A",topic:"Data Interpretation",subtopic:"Overlapping Sets Percentage",difficulty:"Moderate",
 question:"In a survey, 40% of people like tea only, 25% like coffee only, and 20% like both tea and coffee. What percentage like neither?",
 options:{A:"10%",B:"15%",C:"20%",D:"25%"}, correctAnswer:"B",
 explanation:"People who like at least one drink = 40+25+20 = 85%. Hence, people who like neither = 100−85 = 15%."}
];

const MOCK1_PART_B = [
{id:"M1-B-01",section:"B",topic:"Real Analysis",subtopic:"Limits",difficulty:"CSIR-NET Standard",
 question:"Evaluate: \\(\\displaystyle\\lim_{x\\to 0}\\frac{\\sin x - x}{x^3}\\)",
 options:{A:"-1/6",B:"1/6",C:"0",D:"-1/3"}, correctAnswer:"A",
 explanation:"Using the Taylor expansion \\(\\sin x = x - x^3/6 + O(x^5)\\), we get \\(\\sin x - x = -x^3/6 + O(x^5)\\), so the limit is \\(-1/6\\)."},
{id:"M1-B-02",section:"B",topic:"Real Analysis",subtopic:"Sequences",difficulty:"Easy/Moderate",
 question:"The sequence \\(a_n = \\dfrac{(-1)^n}{n}\\) is:",
 options:{A:"Convergent to 0",B:"Divergent",C:"Bounded but not convergent",D:"Unbounded"}, correctAnswer:"A",
 explanation:"\\(|a_n| = 1/n \\to 0\\), so \\(a_n \\to 0\\) regardless of the alternating sign."},
{id:"M1-B-03",section:"B",topic:"Real Analysis",subtopic:"Series Convergence",difficulty:"CSIR-NET Standard",
 question:"The series \\(\\displaystyle\\sum_{n=2}^{\\infty}\\frac{1}{n\\ln n}\\) is:",
 options:{A:"Convergent",B:"Divergent",C:"Conditionally convergent",D:"Absolutely convergent but not convergent"}, correctAnswer:"B",
 explanation:"By the integral test, \\(\\int_2^\\infty \\frac{dx}{x\\ln x} = [\\ln(\\ln x)]_2^\\infty = \\infty\\), so the series diverges."},
{id:"M1-B-04",section:"B",topic:"Real Analysis",subtopic:"Uniform Convergence",difficulty:"Hard",
 question:"The sequence of functions \\(f_n(x) = x^n\\) on \\([0,1]\\) converges uniformly on which of the following sets?",
 options:{A:"[0,1]",B:"[0,1)",C:"[0, 1/2]",D:"None of these"}, correctAnswer:"C",
 explanation:"On [0,1], \\(f_n\\) converges pointwise but not uniformly (the convergence near x=1 is not controlled). On [0,1/2], \\(\\sup |x^n| = (1/2)^n \\to 0\\), so convergence is uniform there."},
{id:"M1-B-05",section:"B",topic:"Linear Algebra",subtopic:"Rank of a Matrix",difficulty:"Easy/Moderate",
 question:"What is the rank of the matrix \\(\\begin{pmatrix}1&2&3\\\\2&4&6\\\\3&6&9\\end{pmatrix}\\)?",
 options:{A:"0",B:"1",C:"2",D:"3"}, correctAnswer:"B",
 explanation:"Every row is a scalar multiple of the first row (R2=2R1, R3=3R1), so only one row is linearly independent: rank = 1."},
{id:"M1-B-06",section:"B",topic:"Linear Algebra",subtopic:"Diagonalizability",difficulty:"CSIR-NET Standard",
 question:"The matrix \\(A=\\begin{pmatrix}2&1\\\\0&2\\end{pmatrix}\\) is:",
 options:{A:"Diagonalizable",B:"Not diagonalizable",C:"Has eigenvalues 2 and −2",D:"Orthogonal"}, correctAnswer:"B",
 explanation:"The only eigenvalue is 2 (repeated, algebraic multiplicity 2), but solving (A-2I)v=0 gives a 1-dimensional eigenspace, so geometric multiplicity 1 < 2. Hence A is not diagonalizable."},
{id:"M1-B-07",section:"B",topic:"Linear Algebra",subtopic:"Characteristic Polynomial",difficulty:"CSIR-NET Standard",
 question:"A 3×3 matrix A has characteristic polynomial \\(\\lambda^3 - 6\\lambda^2 + 11\\lambda - 6\\). What is \\(\\det(A)\\)?",
 options:{A:"6",B:"-6",C:"11",D:"36"}, correctAnswer:"A",
 explanation:"The polynomial factors as \\((\\lambda-1)(\\lambda-2)(\\lambda-3)\\), so the eigenvalues are 1, 2, 3. \\(\\det(A)\\) equals the product of eigenvalues = 1·2·3 = 6."},
{id:"M1-B-08",section:"B",topic:"Linear Algebra",subtopic:"Symmetric Matrices",difficulty:"Easy/Moderate",
 question:"Which of the following is always true for a real symmetric matrix?",
 options:{A:"Its eigenvalues are always real",B:"Its eigenvalues are always complex",C:"It is never diagonalizable",D:"It always has negative determinant"}, correctAnswer:"A",
 explanation:"A standard theorem of linear algebra states that real symmetric matrices have only real eigenvalues (and are in fact orthogonally diagonalizable)."},
{id:"M1-B-09",section:"B",topic:"Abstract Algebra",subtopic:"Order of Elements",difficulty:"Easy/Moderate",
 question:"What is the order of the element 8 in the group \\(\\mathbb{Z}_{12}\\) (under addition)?",
 options:{A:"2",B:"3",C:"4",D:"6"}, correctAnswer:"B",
 explanation:"The order of k in \\(\\mathbb{Z}_n\\) is \\(n/\\gcd(n,k)\\). Here \\(12/\\gcd(12,8) = 12/4 = 3\\)."},
{id:"M1-B-10",section:"B",topic:"Abstract Algebra",subtopic:"Cyclic Groups",difficulty:"Moderate",
 question:"How many elements of order 5 are there in \\(\\mathbb{Z}_{20}\\)?",
 options:{A:"1",B:"4",C:"5",D:"8"}, correctAnswer:"B",
 explanation:"In a cyclic group of order n, the number of elements of order d (for d|n) is \\(\\varphi(d)\\). Here \\(\\varphi(5) = 4\\)."},
{id:"M1-B-11",section:"B",topic:"Abstract Algebra",subtopic:"Fields",difficulty:"Easy/Moderate",
 question:"Which of the following rings is a field?",
 options:{A:"\\(\\mathbb{Z}_4\\)",B:"\\(\\mathbb{Z}_6\\)",C:"\\(\\mathbb{Z}_7\\)",D:"\\(\\mathbb{Z}_8\\)"}, correctAnswer:"C",
 explanation:"\\(\\mathbb{Z}_n\\) is a field if and only if n is prime. Among the options, only 7 is prime."},
{id:"M1-B-12",section:"B",topic:"Complex Analysis",subtopic:"Analytic Functions",difficulty:"Moderate",
 question:"Which of the following functions is entire (analytic on all of \\(\\mathbb{C}\\))?",
 options:{A:"\\(f(z) = 1/z\\)",B:"\\(f(z) = e^z\\)",C:"\\(f(z) = \\bar{z}\\)",D:"\\(f(z) = \\log z\\)"}, correctAnswer:"B",
 explanation:"\\(e^z\\) is analytic everywhere in \\(\\mathbb{C}\\). \\(1/z\\) has a pole at 0, \\(\\bar z\\) fails the Cauchy-Riemann equations, and \\(\\log z\\) is not single-valued/analytic on a branch cut."},
{id:"M1-B-13",section:"B",topic:"Complex Analysis",subtopic:"Residues",difficulty:"CSIR-NET Standard",
 question:"Find the residue of \\(f(z) = \\dfrac{1}{z(z-1)}\\) at \\(z=0\\).",
 options:{A:"1",B:"-1",C:"0",D:"2"}, correctAnswer:"B",
 explanation:"Near \\(z=0\\), \\(f(z) = \\frac{1}{z}\\cdot\\frac{1}{z-1}\\). The residue is the value of \\(\\frac{1}{z-1}\\) at \\(z=0\\), which is \\(-1\\)."},
{id:"M1-B-14",section:"B",topic:"Complex Analysis",subtopic:"Cauchy Integral Formula",difficulty:"CSIR-NET Standard",
 question:"Evaluate \\(\\displaystyle\\oint_{|z|=2} \\frac{e^z}{z-1}\\,dz\\).",
 options:{A:"\\(2\\pi i\\, e\\)",B:"0",C:"\\(2\\pi i\\)",D:"\\(\\pi i\\, e\\)"}, correctAnswer:"A",
 explanation:"Since \\(z=1\\) lies inside \\(|z|=2\\), Cauchy's integral formula gives \\(\\oint \\frac{e^z}{z-1}dz = 2\\pi i \\cdot e^1 = 2\\pi i e\\)."},
{id:"M1-B-15",section:"B",topic:"ODE",subtopic:"Repeated Roots",difficulty:"Easy/Moderate",
 question:"Find the general solution of \\(y'' - 4y' + 4y = 0\\).",
 options:{A:"\\(C_1e^{2x}+C_2e^{-2x}\\)",B:"\\((C_1+C_2x)e^{2x}\\)",C:"\\(C_1\\cos 2x + C_2\\sin 2x\\)",D:"\\(C_1e^{2x}+C_2xe^{-2x}\\)"}, correctAnswer:"B",
 explanation:"The characteristic equation \\(r^2-4r+4=0\\) gives a repeated root \\(r=2\\). For repeated roots, the general solution is \\((C_1+C_2x)e^{2x}\\)."},
{id:"M1-B-16",section:"B",topic:"ODE",subtopic:"Existence & Uniqueness",difficulty:"Hard",
 question:"For the initial value problem \\(y' = y^{2/3},\\; y(0)=0\\), which statement is TRUE?",
 options:{A:"A unique solution exists",B:"Infinitely many solutions exist",C:"No solution exists",D:"A solution exists only for x<0"}, correctAnswer:"B",
 explanation:"Since \\(f(y)=y^{2/3}\\) is not Lipschitz in y near y=0, uniqueness fails. Indeed \\(y\\equiv 0\\) and \\(y=(x/3)^3\\) (and translates/shifts of it) all solve the IVP."},
{id:"M1-B-17",section:"B",topic:"ODE",subtopic:"Laplace Transforms",difficulty:"Easy/Moderate",
 question:"Find the Laplace transform of \\(e^{3t}\\).",
 options:{A:"\\(1/(s-3)\\)",B:"\\(1/(s+3)\\)",C:"\\(3/s^2\\)",D:"\\(1/s^3\\)"}, correctAnswer:"A",
 explanation:"\\(\\mathcal{L}\\{e^{at}\\} = \\dfrac{1}{s-a}\\) for \\(s>a\\); with a=3, this gives \\(1/(s-3)\\)."},
{id:"M1-B-18",section:"B",topic:"PDE",subtopic:"Classification",difficulty:"Easy/Moderate",
 question:"The PDE \\(u_{xx} + u_{yy} = 0\\) (Laplace's equation) is classified as:",
 options:{A:"Elliptic",B:"Parabolic",C:"Hyperbolic",D:"Mixed type"}, correctAnswer:"A",
 explanation:"For \\(Au_{xx}+Bu_{xy}+Cu_{yy}=0\\), the discriminant is \\(B^2-4AC\\). Here A=1,B=0,C=1, so \\(B^2-4AC=-4<0\\): elliptic."},
{id:"M1-B-19",section:"B",topic:"PDE",subtopic:"Classification",difficulty:"Easy/Moderate",
 question:"The wave equation \\(u_{tt} = c^2 u_{xx}\\) is classified as:",
 options:{A:"Elliptic",B:"Parabolic",C:"Hyperbolic",D:"None of these"}, correctAnswer:"C",
 explanation:"Writing it as \\(u_{tt}-c^2u_{xx}=0\\), the discriminant \\(B^2-4AC = 0 - 4(1)(-c^2) = 4c^2 > 0\\), so it is hyperbolic."},
{id:"M1-B-20",section:"B",topic:"Numerical Analysis",subtopic:"Newton-Raphson",difficulty:"Easy/Moderate",
 question:"Using Newton–Raphson with \\(f(x)=x^2-2\\) and \\(x_0=1\\), find \\(x_1\\).",
 options:{A:"1.5",B:"1.4",C:"1.45",D:"2"}, correctAnswer:"A",
 explanation:"\\(x_1 = x_0 - f(x_0)/f'(x_0) = 1 - (-1)/2 = 1 + 0.5 = 1.5\\)."},
{id:"M1-B-21",section:"B",topic:"Numerical Analysis",subtopic:"Order of Convergence",difficulty:"Moderate",
 question:"For a simple root with \\(f'(x)\\neq 0\\), the Newton–Raphson method has order of convergence:",
 options:{A:"Linear",B:"Quadratic",C:"Cubic",D:"Superlinear but not quadratic"}, correctAnswer:"B",
 explanation:"Near a simple root, Newton-Raphson converges quadratically: the error roughly squares at each step, provided \\(f'\\) is nonzero and f is sufficiently smooth."},
{id:"M1-B-22",section:"B",topic:"Probability",subtopic:"Expectation",difficulty:"Easy/Moderate",
 question:"Let \\(X\\sim \\text{Uniform}(0,1)\\). Find \\(E[X^2]\\).",
 options:{A:"1/2",B:"1/3",C:"1/4",D:"1"}, correctAnswer:"B",
 explanation:"\\(E[X^2]=\\int_0^1 x^2\\,dx = \\left[\\dfrac{x^3}{3}\\right]_0^1 = \\dfrac13\\)."},
{id:"M1-B-23",section:"B",topic:"Probability",subtopic:"Union of Independent Events",difficulty:"Easy/Moderate",
 question:"If A and B are independent events with P(A)=0.4 and P(B)=0.5, find P(A∪B).",
 options:{A:"0.9",B:"0.7",C:"0.2",D:"0.5"}, correctAnswer:"B",
 explanation:"For independent events, P(A∩B)=P(A)P(B)=0.2. So P(A∪B)=P(A)+P(B)-P(A∩B)=0.4+0.5-0.2=0.7."},
{id:"M1-B-24",section:"B",topic:"Topology",subtopic:"Compactness",difficulty:"Moderate",
 question:"Which of the following subsets of \\(\\mathbb{R}\\) (usual topology) is compact?",
 options:{A:"(0,1)",B:"[0,1]",C:"\\(\\mathbb{R}\\)",D:"\\(\\mathbb{Q}\\cap[0,1]\\)"}, correctAnswer:"B",
 explanation:"By the Heine-Borel theorem, a subset of \\(\\mathbb{R}\\) is compact iff it is closed and bounded. [0,1] is the only closed and bounded set listed."},
{id:"M1-B-25",section:"B",topic:"Topology",subtopic:"Connectedness",difficulty:"Moderate",
 question:"The continuous image of a connected topological space is:",
 options:{A:"Always connected",B:"Always disconnected",C:"May or may not be connected",D:"Always compact"}, correctAnswer:"A",
 explanation:"Connectedness is a topological invariant preserved by continuous maps: the continuous image of a connected space is always connected."},
{id:"M1-B-26",section:"B",topic:"Functional Analysis",subtopic:"Riesz Representation",difficulty:"CSIR-NET Standard",
 question:"The result that every bounded linear functional on a Hilbert space H can be represented as an inner product with a fixed vector in H is known as:",
 options:{A:"Hahn–Banach theorem",B:"Riesz Representation theorem",C:"Open Mapping theorem",D:"Uniform Boundedness Principle"}, correctAnswer:"B",
 explanation:"This is precisely the statement of the Riesz Representation theorem for Hilbert spaces."}
];

const MOCK1_PART_C = [
{id:"M1-C-01",section:"C",topic:"Real Analysis",subtopic:"Sequences",difficulty:"CSIR-NET Standard",
 question:"Which of the following statements about sequences in \\(\\mathbb{R}\\) are TRUE?",
 options:{A:"Every Cauchy sequence in \\(\\mathbb{R}\\) converges.",B:"Every bounded sequence in \\(\\mathbb{R}\\) has a convergent subsequence.",C:"Every convergent sequence is bounded.",D:"Every monotonic sequence converges."},
 correctAnswer:["A","B","C"],
 explanation:"A: True — \\(\\mathbb{R}\\) is complete. B: True — Bolzano-Weierstrass theorem. C: True — convergent sequences are always bounded. D: False — e.g. \\(a_n=n\\) is monotonic increasing but unbounded, hence divergent."},
{id:"M1-C-02",section:"C",topic:"Real Analysis",subtopic:"Continuity on Compact Sets",difficulty:"CSIR-NET Standard",
 question:"Let \\(f:[0,1]\\to\\mathbb{R}\\) be continuous. Which of the following are necessarily TRUE?",
 options:{A:"f is bounded on [0,1].",B:"f attains its maximum and minimum on [0,1].",C:"f is uniformly continuous on [0,1].",D:"f is differentiable on [0,1]."},
 correctAnswer:["A","B","C"],
 explanation:"Since [0,1] is compact, a continuous f on it is bounded (A), attains its extrema (B, extreme value theorem), and is uniformly continuous (C, Heine-Cantor theorem). D is false: e.g. \\(f(x)=|x-1/2|\\) is continuous but not differentiable at x=1/2."},
{id:"M1-C-03",section:"C",topic:"Real Analysis",subtopic:"Alternating Series",difficulty:"Moderate",
 question:"Consider the series \\(\\sum_{n=1}^{\\infty} a_n\\) where \\(a_n=(-1)^n/n\\). Which statements are TRUE?",
 options:{A:"The series converges.",B:"The series converges absolutely.",C:"The series converges conditionally.",D:"\\(\\sum |a_n|\\) diverges."},
 correctAnswer:["A","C","D"],
 explanation:"By the alternating series test, \\(\\sum (-1)^n/n\\) converges (A). But \\(\\sum |a_n| = \\sum 1/n\\) is the harmonic series, which diverges (D), so the convergence is conditional, not absolute (C true, B false)."},
{id:"M1-C-04",section:"C",topic:"Real Analysis",subtopic:"Interchange of Limit and Integral",difficulty:"Very Hard",
 question:"Let \\(f_n(x) = n^2 x(1-x)^n\\) for \\(x\\in[0,1]\\). Which statements are TRUE?",
 options:{A:"\\(f_n \\to 0\\) pointwise on [0,1].",B:"\\(f_n \\to 0\\) uniformly on [0,1].",C:"\\(\\lim_{n\\to\\infty}\\int_0^1 f_n(x)\\,dx = 0\\).",D:"\\(\\lim_{n\\to\\infty}\\int_0^1 f_n\\,dx = \\int_0^1 \\lim_{n\\to\\infty} f_n\\,dx\\)."},
 correctAnswer:["A"],
 explanation:"For fixed x>0, \\((1-x)^n\\) decays exponentially, dominating the \\(n^2\\) growth, so \\(f_n(x)\\to 0\\); at x=0, x=1 it's also 0. So A is true. Using \\(\\int_0^1 x(1-x)^n dx = \\frac{1}{(n+1)(n+2)}\\), we get \\(\\int_0^1 f_n\\,dx = \\frac{n^2}{(n+1)(n+2)} \\to 1 \\neq 0\\), so C and D are false. Since the integrals don't go to 0 while the pointwise limit is 0, convergence cannot be uniform (if it were uniform, the integral of the limit would equal the limit of the integrals) — so B is false. This is a classic example showing pointwise convergence does not justify interchanging limit and integral."},
{id:"M1-C-05",section:"C",topic:"Real Analysis",subtopic:"Compactness in R",difficulty:"CSIR-NET Standard",
 question:"Which of the following statements are TRUE?",
 options:{A:"If \\(A\\subseteq\\mathbb{R}\\) is compact, then A is closed and bounded.",B:"If \\(A\\subseteq\\mathbb{R}\\) is closed and bounded, then A is compact.",C:"Every compact subset of \\(\\mathbb{R}\\) is finite.",D:"The set \\(\\{1/n : n\\in\\mathbb{N}\\}\\cup\\{0\\}\\) is compact."},
 correctAnswer:["A","B","D"],
 explanation:"A and B together are the Heine-Borel theorem for \\(\\mathbb{R}\\). C is false — e.g. [0,1] is compact but infinite. D is true: the set is closed (it contains its only limit point, 0) and bounded, hence compact by Heine-Borel."},
{id:"M1-C-06",section:"C",topic:"Linear Algebra",subtopic:"Eigenvalues and Trace",difficulty:"CSIR-NET Standard",
 question:"Let A be an n×n real matrix. Which of the following statements are TRUE?",
 options:{A:"If A is invertible, then 0 is not an eigenvalue of A.",B:"If \\(A^2=A\\) (A is idempotent), then every eigenvalue of A is 0 or 1.",C:"The trace of A equals the sum of its eigenvalues, counted with algebraic multiplicity.",D:"\\(\\det(A)\\) equals the product of the diagonal entries of A for any square matrix A."},
 correctAnswer:["A","B","C"],
 explanation:"A: True, since Av=0 for eigenvalue 0 would contradict invertibility. B: True — if \\(Av=\\lambda v\\), then \\(A^2v = \\lambda^2 v = Av = \\lambda v\\), forcing \\(\\lambda^2=\\lambda\\), i.e. \\(\\lambda\\in\\{0,1\\}\\). C: True, a standard fact from the characteristic polynomial. D: False in general — this only holds for triangular matrices, not arbitrary square matrices."},
{id:"M1-C-07",section:"C",topic:"Linear Algebra",subtopic:"Rank-Nullity",difficulty:"Moderate",
 question:"Let \\(T:\\mathbb{R}^3\\to\\mathbb{R}^3\\) be a linear map with \\(\\text{rank}(T)=2\\). Which statements are TRUE?",
 options:{A:"nullity(T) = 1.",B:"T is not injective.",C:"T is not surjective.",D:"T could be invertible."},
 correctAnswer:["A","B","C"],
 explanation:"By rank-nullity, rank+nullity=3, so nullity=1 (A true). Since nullity>0, T has a nontrivial kernel, so T is not injective (B true). Since rank(T)=2<3=dim(codomain), T is not surjective (C true). D is false: a linear map between spaces of equal finite dimension is invertible iff it is injective (equivalently surjective); since T is neither, it cannot be invertible."},
{id:"M1-C-08",section:"C",topic:"Linear Algebra",subtopic:"Orthogonal Matrices",difficulty:"Hard",
 question:"Let \\(A=\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}\\) (rotation by 90°) over \\(\\mathbb{R}\\). Which statements are TRUE?",
 options:{A:"A has real eigenvalues.",B:"A has eigenvalues \\(\\pm i\\).",C:"A is orthogonal (\\(AA^T=I\\)).",D:"\\(A^2=-I\\)."},
 correctAnswer:["B","C","D"],
 explanation:"The characteristic polynomial is \\(\\lambda^2+1=0\\), giving eigenvalues \\(\\pm i\\) (B true, A false — no real eigenvalues). Direct computation shows \\(AA^T=I\\), so A is orthogonal (C true). Also \\(A^2=\\begin{pmatrix}-1&0\\\\0&-1\\end{pmatrix}=-I\\) (D true)."},
{id:"M1-C-09",section:"C",topic:"Abstract Algebra",subtopic:"Klein Four-Group",difficulty:"Moderate",
 question:"Which of the following statements about the group \\(\\mathbb{Z}_2\\times\\mathbb{Z}_2\\) are TRUE?",
 options:{A:"It is cyclic.",B:"Every non-identity element has order 2.",C:"It is isomorphic to \\(\\mathbb{Z}_4\\).",D:"It is abelian."},
 correctAnswer:["B","D"],
 explanation:"\\(\\mathbb{Z}_2\\times\\mathbb{Z}_2\\) has no element of order 4, so it is not cyclic (A false) and not isomorphic to \\(\\mathbb{Z}_4\\), which is cyclic (C false). Every non-identity element (1,0),(0,1),(1,1) has order 2 (B true), and the direct product of abelian groups is abelian (D true)."},
{id:"M1-C-10",section:"C",topic:"Abstract Algebra",subtopic:"Sylow Theorems",difficulty:"Very Hard",
 question:"Let G be a group of order 15. Which statements are TRUE?",
 options:{A:"G is cyclic.",B:"G is abelian.",C:"G has a normal Sylow 5-subgroup.",D:"G has a normal Sylow 3-subgroup."},
 correctAnswer:["A","B","C","D"],
 explanation:"|G|=15=3·5. By Sylow's theorems, \\(n_5\\equiv 1\\pmod 5\\) and \\(n_5\\mid 3\\), forcing \\(n_5=1\\) (C true, normal). Also \\(n_3\\equiv 1\\pmod 3\\) and \\(n_3\\mid 5\\), forcing \\(n_3=1\\) (D true, normal). With both Sylow subgroups normal and trivial intersection, \\(G\\cong \\mathbb{Z}_3\\times\\mathbb{Z}_5 \\cong \\mathbb{Z}_{15}\\) since \\(\\gcd(3,5)=1\\); this is cyclic (A true) and hence abelian (B true)."},
{id:"M1-C-11",section:"C",topic:"Abstract Algebra",subtopic:"Ideals",difficulty:"Moderate",
 question:"Which of the following subsets are ideals of the ring \\(\\mathbb{Z}\\)?",
 options:{A:"The set of even integers.",B:"The set of multiples of 5.",C:"The set \\(\\{0,1\\}\\).",D:"The set of odd integers."},
 correctAnswer:["A","B"],
 explanation:"For any \\(n\\), \\(n\\mathbb{Z}\\) (multiples of n) is an ideal of \\(\\mathbb{Z}\\): closed under addition and absorbs multiplication by any ring element. So A (\\(2\\mathbb{Z}\\)) and B (\\(5\\mathbb{Z}\\)) are ideals. C is not even a subgroup (1+1=2 ∉ {0,1}). D is not closed under addition (1+1=2 is not odd) and doesn't contain 0."},
{id:"M1-C-12",section:"C",topic:"Complex Analysis",subtopic:"Singularities",difficulty:"CSIR-NET Standard",
 question:"Consider \\(f(z)=1/z\\) on \\(\\mathbb{C}\\setminus\\{0\\}\\). Which statements are TRUE?",
 options:{A:"f is analytic on \\(\\mathbb{C}\\setminus\\{0\\}\\).",B:"f has a removable singularity at z=0.",C:"f has a simple pole at z=0.",D:"The residue of f at z=0 is 1."},
 correctAnswer:["A","C","D"],
 explanation:"f is analytic away from 0 (A true). At z=0, f is unbounded, so the singularity is a pole, not removable (B false); it is a simple (order 1) pole (C true), and the residue — the coefficient of \\(1/z\\) in the Laurent series, which is just f itself here — is 1 (D true)."},
{id:"M1-C-13",section:"C",topic:"Complex Analysis",subtopic:"Liouville's Theorem",difficulty:"Hard",
 question:"Let f be an entire function that is bounded on all of \\(\\mathbb{C}\\). Which statements are TRUE?",
 options:{A:"f must be constant.",B:"f could be a non-constant polynomial.",C:"If additionally f(0)=0, then f is identically 0.",D:"There exist non-constant bounded entire functions."},
 correctAnswer:["A","C"],
 explanation:"By Liouville's theorem, a bounded entire function must be constant (A true). B and D contradict Liouville's theorem directly (non-constant polynomials, e.g. z, are unbounded; hence no non-constant bounded entire functions exist) — both false. C is true: if f is constant and f(0)=0, that constant is 0, so f≡0."},
{id:"M1-C-14",section:"C",topic:"ODE",subtopic:"Existence and Uniqueness",difficulty:"Hard",
 question:"For the IVP \\(y'=f(x,y),\\, y(x_0)=y_0\\), which of the following, taken alone, GUARANTEES a unique local solution?",
 options:{A:"f is continuous in a neighbourhood of \\((x_0,y_0)\\).",B:"f satisfies a Lipschitz condition in y, with no continuity assumption stated.",C:"f is continuous and satisfies a Lipschitz condition in y near \\((x_0,y_0)\\).",D:"f is merely bounded near \\((x_0,y_0)\\)."},
 correctAnswer:["C"],
 explanation:"Continuity alone (A, Peano's theorem) guarantees existence but not uniqueness — e.g. \\(y'=y^{2/3}\\) is continuous but non-unique at y=0. The Picard–Lindelöf theorem requires both continuity and a Lipschitz condition in y (C), which together guarantee existence AND uniqueness. B is not a standard sufficient hypothesis without continuity, and D (mere boundedness) does not prevent non-uniqueness (the same \\(y^{2/3}\\) example is bounded near 0)."},
{id:"M1-C-15",section:"C",topic:"ODE",subtopic:"Linear Systems Stability",difficulty:"CSIR-NET Standard",
 question:"For the linear system \\(X'=AX\\), where A is a constant 2×2 real matrix, which statements are TRUE?",
 options:{A:"If both eigenvalues of A are negative, the origin is asymptotically stable.",B:"If the eigenvalues of A are purely imaginary and nonzero, trajectories form closed orbits around the origin (a center).",C:"If the eigenvalues have opposite signs, the origin is a saddle point (unstable).",D:"If both eigenvalues of A are positive, the origin is asymptotically stable."},
 correctAnswer:["A","B","C"],
 explanation:"A: True — both eigenvalues negative means all solutions decay to 0. B: True — purely imaginary eigenvalues give periodic, closed orbits (a center). C: True — this is the standard saddle point classification. D: False — positive eigenvalues make solutions grow without bound, so the origin is unstable (a source), not asymptotically stable."},
{id:"M1-C-16",section:"C",topic:"PDE",subtopic:"Heat Equation Properties",difficulty:"Hard",
 question:"Consider the heat equation \\(u_t = k u_{xx}\\) with \\(k>0\\). Which statements are TRUE?",
 options:{A:"It is a parabolic PDE.",B:"The maximum principle holds: the solution attains its maximum on the initial/boundary data.",C:"Information propagates with finite speed, exactly like the wave equation.",D:"Solutions become smoother (infinitely differentiable in x) for t>0, even for rough initial data."},
 correctAnswer:["A","B","D"],
 explanation:"A: True (discriminant \\(B^2-4AC = 0\\), the parabolic case). B: True, this is the classical maximum principle for the heat equation. C: False — the heat equation has the (physically unrealistic) property of infinite propagation speed, unlike the wave equation. D: True — this is the well-known smoothing property of the heat kernel."},
{id:"M1-C-17",section:"C",topic:"Topology",subtopic:"Properties of [0,1]",difficulty:"Moderate",
 question:"Let \\(X=[0,1]\\) with the usual (subspace) topology from \\(\\mathbb{R}\\). Which statements are TRUE?",
 options:{A:"X is compact.",B:"X is connected.",C:"X is path-connected.",D:"X is discrete."},
 correctAnswer:["A","B","C"],
 explanation:"[0,1] is closed and bounded, hence compact by Heine-Borel (A true). It is a classical example of a connected (B true) and path-connected (C true, via straight-line paths) space. It is certainly not discrete (D false), since e.g. {0} is not open in the subspace topology."},
{id:"M1-C-18",section:"C",topic:"Topology",subtopic:"Compactness Examples",difficulty:"CSIR-NET Standard",
 question:"Which of the following spaces are compact (with the subspace/usual topology)?",
 options:{A:"The closed unit disk \\(\\{(x,y): x^2+y^2\\le 1\\}\\) in \\(\\mathbb{R}^2\\).",B:"The open interval (0,1) in \\(\\mathbb{R}\\).",C:"Any finite set with the discrete topology.",D:"\\(\\mathbb{R}\\) with the usual topology."},
 correctAnswer:["A","C"],
 explanation:"A: True — closed and bounded in \\(\\mathbb{R}^2\\), so compact by Heine-Borel. B: False — (0,1) is bounded but not closed; e.g. the open cover \\(\\{(1/n,1-1/n)\\}\\) has no finite subcover. C: True — any finite topological space is compact, since any open cover already has finitely many sets to cover finitely many points. D: False — \\(\\mathbb{R}\\) is unbounded, hence not compact."},
{id:"M1-C-19",section:"C",topic:"Functional Analysis",subtopic:"Bounded Operators on Hilbert Space",difficulty:"CSIR-NET Standard",
 question:"Let H be a Hilbert space and \\(T:H\\to H\\) a bounded linear operator. Which statements are TRUE?",
 options:{A:"If T is self-adjoint, then every eigenvalue of T (if it has any) is real.",B:"Every bounded linear operator on H has a well-defined adjoint \\(T^*\\).",C:"If T is unitary, then \\(\\|Tx\\|=\\|x\\|\\) for all \\(x\\in H\\).",D:"The kernel of T is always finite-dimensional."},
 correctAnswer:["A","B","C"],
 explanation:"A: True, a standard fact about self-adjoint operators. B: True — on a Hilbert space, every bounded operator has a bounded adjoint, by the Riesz representation theorem. C: True, by definition unitary operators are isometries. D: False — the kernel of a bounded operator can certainly be infinite-dimensional (e.g. a projection onto a finite-dimensional subspace has infinite-dimensional kernel in an infinite-dimensional H)."},
{id:"M1-C-20",section:"C",topic:"Functional Analysis",subtopic:"Normed Spaces",difficulty:"Hard",
 question:"Which of the following statements about normed spaces are TRUE?",
 options:{A:"Every finite-dimensional normed space is complete (a Banach space).",B:"Every normed space is a Hilbert space.",C:"In a finite-dimensional normed space, all norms are equivalent.",D:"Closed and bounded sets are compact in every normed space."},
 correctAnswer:["A","C"],
 explanation:"A: True — finite-dimensional normed spaces are always complete. C: True — a classical theorem states all norms on a finite-dimensional vector space are equivalent. B: False — a Hilbert space needs an inner product inducing the norm (parallelogram law), which most normed spaces do not satisfy. D: False in general — this (Heine-Borel-type property) fails in infinite-dimensional normed spaces; it only holds in finite dimensions."},
{id:"M1-C-21",section:"C",topic:"Probability",subtopic:"Variance Properties",difficulty:"Moderate",
 question:"Let X be a random variable with finite variance. Which statements are TRUE?",
 options:{A:"\\(\\text{Var}(X) = E[X^2] - (E[X])^2\\).",B:"\\(\\text{Var}(aX+b) = a^2\\text{Var}(X)\\) for constants a, b.",C:"If X and Y are independent, \\(\\text{Var}(X+Y) = \\text{Var}(X)+\\text{Var}(Y)\\).",D:"\\(\\text{Var}(X)\\) can be negative."},
 correctAnswer:["A","B","C"],
 explanation:"A, B, C are all standard, well-known properties of variance. D is false: variance is defined as \\(E[(X-E[X])^2]\\), an expectation of a non-negative quantity, so it is always \\(\\geq 0\\)."},
{id:"M1-C-22",section:"C",topic:"Numerical Analysis",subtopic:"Bisection Method",difficulty:"Moderate",
 question:"Regarding the bisection method for finding a root of \\(f(x)=0\\) on \\([a,b]\\) with \\(f(a)f(b)<0\\), which statements are TRUE?",
 options:{A:"The method always converges to a root if f is continuous on [a,b].",B:"The rate of convergence is linear.",C:"The method requires f to be differentiable.",D:"Each iteration halves the length of the interval known to contain a root."},
 correctAnswer:["A","B","D"],
 explanation:"A: True — continuity plus the sign change guarantees (by the intermediate value theorem) that bisection converges to a root. B: True — the error is halved at each step, giving linear convergence. C: False — bisection only needs continuity of f, not differentiability. D: True, by construction."}
];

const MOCK_TESTS = [
  { mockNumber:1, title:"Mock Test 1", available:true, sections:{A:MOCK1_PART_A,B:MOCK1_PART_B,C:MOCK1_PART_C} },
  { mockNumber:2, title:"Mock Test 2", available:false, sections:{A:[],B:[],C:[]} },
  { mockNumber:3, title:"Mock Test 3", available:false, sections:{A:[],B:[],C:[]} },
  { mockNumber:4, title:"Mock Test 4", available:false, sections:{A:[],B:[],C:[]} },
  { mockNumber:5, title:"Mock Test 5", available:false, sections:{A:[],B:[],C:[]} }
];

/* ---------------------- 3. STATE MANAGEMENT ------------------------------ */
const STORAGE_KEY = "CSIR_STATE";
const RESULTS_KEY = "CSIR_RESULTS";

let state = null;      // active in-progress test state
let timerInterval = null;
let pendingMock = null; // mock chosen on dashboard, before test starts

function buildFullQuestionList(mock){
  return [...mock.sections.A, ...mock.sections.B, ...mock.sections.C];
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}
function saveState(){
  if(state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function clearState(){
  localStorage.removeItem(STORAGE_KEY);
  state = null;
}
function saveResultRecord(result){
  let all = [];
  try{ all = JSON.parse(localStorage.getItem(RESULTS_KEY)) || []; }catch(e){ all = []; }
  all.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
}

/* ---------------------- 4. DASHBOARD -------------------------------------- */
function renderDashboard(){
  const wrap = document.getElementById("mock-cards");
  wrap.innerHTML = "";
  MOCK_TESTS.forEach(mock => {
    const card = document.createElement("div");
    card.className = "mock-card" + (mock.available ? "" : " disabled");
    const total = mock.available ? buildFullQuestionList(mock).length : 0;
    card.innerHTML = `
      ${mock.available ? "" : '<div class="status-tag">In preparation</div>'}
      <h3>${mock.title.toUpperCase()}</h3>
      <div class="meta">
        <div>${mock.available ? total : "—"} Questions</div>
        <div>${TOTAL_DURATION_MIN} Minutes</div>
      </div>
      <button class="btn btn-primary" data-mock="${mock.mockNumber}">START TEST</button>
    `;
    wrap.appendChild(card);
  });
  wrap.querySelectorAll("button[data-mock]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const num = parseInt(btn.getAttribute("data-mock"),10);
      const mock = MOCK_TESTS.find(m=>m.mockNumber===num);
      if(!mock.available){
        alert("This mock test's question bank is still being finalized to make sure every question is mathematically verified. Mock Test 1 is fully ready — please start there. Ask to have this mock generated next and it can be added.");
        return;
      }
      // If there's a saved in-progress test for a DIFFERENT mock, warn before overwriting
      const existing = loadState();
      if(existing && existing.mockNumber !== num && !existing.testSubmitted){
        if(!confirm("You have an in-progress test for another mock. Starting a new one will discard that progress. Continue?")) return;
      }
      pendingMock = mock;
      showInstructions(mock);
    });
  });
}

/* ---------------------- 5. INSTRUCTIONS ------------------------------------ */
function showInstructions(mock){
  document.getElementById("instr-title").textContent = mock.title.toUpperCase();
  document.getElementById("instr-total-q").textContent = buildFullQuestionList(mock).length;
  document.getElementById("instr-duration").textContent = TOTAL_DURATION_MIN;
  document.getElementById("instr-max-attempt").textContent = TOTAL_MAX_ATTEMPT;

  const mkList = (rule, qType) => `
    <li>${rule.available} available</li>
    <li>Maximum ${rule.maxAttempt} attempts</li>
    <li>${rule.correctMarks} marks for each correct answer</li>
    <li>${rule.negativeMarks>0 ? rule.negativeMarks+" mark negative for each incorrect answer" : "No negative marking"}</li>
    <li>${qType}</li>
  `;
  document.getElementById("instr-part-a").innerHTML = mkList(MARKING_RULES.A, "Single-correct MCQ");
  document.getElementById("instr-part-b").innerHTML = mkList(MARKING_RULES.B, "Single-correct MCQ");
  document.getElementById("instr-part-c").innerHTML = mkList(MARKING_RULES.C, "Multiple-select (MSQ) — full marks only if your selection exactly matches all correct options");

  switchScreen("screen-instructions");
}

/* ---------------------- 6. START / RESUME TEST ----------------------------- */
function startTest(mock){
  const questions = buildFullQuestionList(mock);
  state = {
    mockNumber: mock.mockNumber,
    mockTitle: mock.title,
    questions: questions.map(q=>({id:q.id})), // order reference only; full data pulled from MOCK_TESTS by id
    answers: {},              // questionId -> "A" | ["A","C"]
    markedForReview: {},      // questionId -> true
    visited: {},              // questionId -> true
    currentIndex: 0,
    remainingSeconds: TOTAL_DURATION_MIN*60,
    testStarted: true,
    testSubmitted: false,
    startedAt: Date.now()
  };
  saveState();
  enterExamScreen();
}

function resumeTest(){
  enterExamScreen();
}

function getMockByNumber(num){
  return MOCK_TESTS.find(m=>m.mockNumber===num);
}
function getActiveQuestions(){
  const mock = getMockByNumber(state.mockNumber);
  return buildFullQuestionList(mock);
}
function getQuestionById(id){
  return getActiveQuestions().find(q=>q.id===id);
}

/* ---------------------- 7. EXAM SCREEN -------------------------------------- */
function enterExamScreen(){
  switchScreen("screen-exam");
  document.getElementById("exam-mock-title").textContent = state.mockTitle.toUpperCase();
  renderPalette();
  renderQuestion();
  updateProgressBar();
  startTimer();
}

function currentQuestion(){
  const q = getActiveQuestions()[state.currentIndex];
  return q;
}

function sectionOf(index){
  const q = getActiveQuestions()[index];
  return q.section;
}

function renderQuestion(){
  const q = currentQuestion();
  state.visited[q.id] = true;
  saveState();

  document.getElementById("q-position").textContent = `Question ${state.currentIndex+1} / ${getActiveQuestions().length}`;
  const partLabel = q.section==="A"?"PART A — Aptitude":q.section==="B"?"PART B — Mathematical Sciences (MCQ)":"PART C — Mathematical Sciences (MSQ)";
  document.getElementById("q-part-badge").textContent = partLabel;
  const rule = MARKING_RULES[q.section];
  document.getElementById("q-marks-info").textContent = q.section==="C"
    ? `+${rule.correctMarks} marks (all-or-nothing), no negative marking`
    : `+${rule.correctMarks} marks, -${rule.negativeMarks} negative`;

  const qContent = document.getElementById("q-content");
  qContent.innerHTML = `<span class="topic-line">${q.topic} — ${q.subtopic} · ${q.difficulty}</span>${q.question}`;

  const optionsWrap = document.getElementById("q-options");
  optionsWrap.innerHTML = "";
  const isMSQ = q.section === "C";
  const existingAnswer = state.answers[q.id];

  ["A","B","C","D"].forEach(letter=>{
    const div = document.createElement("div");
    const selected = isMSQ ? (Array.isArray(existingAnswer) && existingAnswer.includes(letter)) : (existingAnswer===letter);
    div.className = "q-option" + (selected ? " selected" : "");
    const inputId = `opt-${letter}`;
    div.innerHTML = `
      <input type="${isMSQ?'checkbox':'radio'}" name="qopt" id="${inputId}" value="${letter}" ${selected?"checked":""}>
      <label for="${inputId}"><b>${letter}.</b> ${q.options[letter]}</label>
    `;
    optionsWrap.appendChild(div);
  });

  optionsWrap.querySelectorAll("input").forEach(inp=>{
    inp.addEventListener("change", ()=> handleOptionChange(q, isMSQ));
  });

  // typeset MathJax
  if(window.MathJax && window.MathJax.typesetPromise){
    window.MathJax.typesetPromise([qContent, optionsWrap]).catch(()=>{});
  }

  updatePaletteHighlight();
  updateProgressBar();
}

function countAnsweredInSection(section){
  const ids = getActiveQuestions().filter(q=>q.section===section).map(q=>q.id);
  return ids.filter(id => {
    const a = state.answers[id];
    return a !== undefined && a !== null && (Array.isArray(a) ? a.length>0 : true);
  }).length;
}

function handleOptionChange(q, isMSQ){
  const section = q.section;
  const rule = MARKING_RULES[section];
  const alreadyAnswered = state.answers[q.id] !== undefined && state.answers[q.id] !== null &&
      (Array.isArray(state.answers[q.id]) ? state.answers[q.id].length>0 : true);

  if(isMSQ){
    const checked = Array.from(document.querySelectorAll('#q-options input:checked')).map(i=>i.value);
    // Enforce limit: only block if this question wasn't already counted as answered
    if(!alreadyAnswered && checked.length>0 && countAnsweredInSection(section) >= rule.maxAttempt){
      alert(`You have already reached the maximum attempt limit for ${MARKING_RULES[section].label} (${rule.maxAttempt}). Clear another answer in this part first, or continue without answering this question.`);
      // revert
      renderQuestion();
      return;
    }
    state.answers[q.id] = checked;
    if(checked.length===0) delete state.answers[q.id];
  } else {
    const checked = document.querySelector('#q-options input:checked');
    const val = checked ? checked.value : null;
    if(!alreadyAnswered && val && countAnsweredInSection(section) >= rule.maxAttempt){
      alert(`You have already reached the maximum attempt limit for ${MARKING_RULES[section].label} (${rule.maxAttempt}). Clear another answer in this part first, or continue without answering this question.`);
      renderQuestion();
      return;
    }
    if(val) state.answers[q.id] = val; else delete state.answers[q.id];
  }
  saveState();
  refreshOptionHighlights();
  updateProgressBar();
  updatePaletteForQuestion(q.id);
}

function refreshOptionHighlights(){
  document.querySelectorAll('#q-options .q-option').forEach(div=>{
    const input = div.querySelector('input');
    div.classList.toggle('selected', input.checked);
  });
}

function updateProgressBar(){
  const a = countAnsweredInSection("A"), b = countAnsweredInSection("B"), c = countAnsweredInSection("C");
  document.getElementById("prog-a").textContent = a;
  document.getElementById("prog-b").textContent = b;
  document.getElementById("prog-c").textContent = c;
  document.getElementById("prog-total").textContent = a+b+c;
}

/* ---------------------- 8. NAVIGATION -------------------------------------- */
document.addEventListener("DOMContentLoaded", init);

function goToIndex(idx){
  const max = getActiveQuestions().length - 1;
  if(idx<0) idx=0;
  if(idx>max) idx=max;
  state.currentIndex = idx;
  saveState();
  renderQuestion();
}

function wireExamNav(){
  document.getElementById("btn-prev").addEventListener("click", ()=> goToIndex(state.currentIndex-1));
  document.getElementById("btn-save-next").addEventListener("click", ()=> goToIndex(state.currentIndex+1));
  document.getElementById("btn-mark-review").addEventListener("click", ()=>{
    const q = currentQuestion();
    state.markedForReview[q.id] = true;
    saveState();
    updatePaletteForQuestion(q.id);
    goToIndex(state.currentIndex+1);
  });
  document.getElementById("btn-clear").addEventListener("click", ()=>{
    const q = currentQuestion();
    delete state.answers[q.id];
    saveState();
    renderQuestion();
  });
  document.getElementById("btn-toggle-palette").addEventListener("click", ()=>{
    document.getElementById("palette-panel").classList.toggle("open");
  });
  document.getElementById("btn-submit-test").addEventListener("click", openSubmitModal);
  document.getElementById("btn-cancel-submit").addEventListener("click", ()=>{
    document.getElementById("modal-submit").classList.remove("open");
  });
  document.getElementById("btn-confirm-submit").addEventListener("click", ()=>{
    document.getElementById("modal-submit").classList.remove("open");
    submitTest(false);
  });
}

/* ---------------------- 9. QUESTION PALETTE --------------------------------- */
function paletteStatus(q){
  const answered = state.answers[q.id] !== undefined && state.answers[q.id] !== null &&
      (Array.isArray(state.answers[q.id]) ? state.answers[q.id].length>0 : true);
  const marked = !!state.markedForReview[q.id];
  const visited = !!state.visited[q.id];
  if(marked && answered) return "marked-answered";
  if(marked) return "marked";
  if(answered) return "answered";
  if(visited) return "unanswered";
  return "not-visited";
}

function renderPalette(){
  const questions = getActiveQuestions();
  const grids = {A:document.getElementById("palette-a"), B:document.getElementById("palette-b"), C:document.getElementById("palette-c")};
  grids.A.innerHTML=""; grids.B.innerHTML=""; grids.C.innerHTML="";
  questions.forEach((q, idx)=>{
    const btn = document.createElement("button");
    btn.className = "palette-btn " + paletteStatus(q);
    btn.textContent = idx+1;
    btn.dataset.qid = q.id;
    btn.addEventListener("click", ()=>{
      goToIndex(idx);
      document.getElementById("palette-panel").classList.remove("open");
    });
    grids[q.section].appendChild(btn);
  });
  updatePaletteHighlight();
}

function updatePaletteForQuestion(qid){
  const q = getQuestionById(qid);
  const btn = document.querySelector(`.palette-btn[data-qid="${qid}"]`);
  if(btn){ btn.className = "palette-btn " + paletteStatus(q); if(qid===currentQuestion().id) btn.classList.add("current"); }
}

function updatePaletteHighlight(){
  document.querySelectorAll(".palette-btn").forEach(b=>b.classList.remove("current"));
  const q = currentQuestion();
  const btn = document.querySelector(`.palette-btn[data-qid="${q.id}"]`);
  if(btn) btn.classList.add("current");
}

/* ---------------------- 10. TIMER -------------------------------------------- */
function startTimer(){
  clearInterval(timerInterval);
  updateTimerDisplay();
  timerInterval = setInterval(()=>{
    state.remainingSeconds -= 1;
    if(state.remainingSeconds <= 0){
      state.remainingSeconds = 0;
      saveState();
      updateTimerDisplay();
      clearInterval(timerInterval);
      submitTest(true);
      return;
    }
    if(state.remainingSeconds % 5 === 0) saveState(); // periodic persist, not every tick
    updateTimerDisplay();
  }, 1000);
}
function updateTimerDisplay(){
  const s = state.remainingSeconds;
  const h = String(Math.floor(s/3600)).padStart(2,"0");
  const m = String(Math.floor((s%3600)/60)).padStart(2,"0");
  const sec = String(s%60).padStart(2,"0");
  const el = document.getElementById("timer-display");
  el.textContent = `${h}:${m}:${sec}`;
  el.classList.toggle("low-time", s <= 300);
}

/* ---------------------- 11. SUBMIT ------------------------------------------- */
function openSubmitModal(){
  const attempted = countAnsweredInSection("A")+countAnsweredInSection("B")+countAnsweredInSection("C");
  document.getElementById("modal-attempted").textContent = attempted;
  document.getElementById("modal-unattempted").textContent = getActiveQuestions().length - attempted;
  document.getElementById("modal-submit").classList.add("open");
}

function submitTest(auto){
  clearInterval(timerInterval);
  const result = calculateScore();
  result.auto = auto;
  saveResultRecord(result);
  state.testSubmitted = true;
  state.lastResult = result;
  saveState();
  renderResult(result);
  switchScreen("screen-result");
}

/* ---------------------- 12. SCORING ------------------------------------------ */
function calculatePartABScore(section){
  const rule = MARKING_RULES[section];
  const qs = getActiveQuestions().filter(q=>q.section===section);
  let attempted=0, correct=0, wrong=0, score=0;
  qs.forEach(q=>{
    const ans = state.answers[q.id];
    if(ans === undefined || ans === null || ans === "") return;
    attempted++;
    if(ans === q.correctAnswer){ correct++; score += rule.correctMarks; }
    else { wrong++; score -= rule.negativeMarks; }
  });
  return {attempted, correct, wrong, score};
}

// Separate, easily adjustable Part C (MSQ) scoring function.
// Current rule: full marks only if the candidate's selected set exactly
// equals the correct set (standard official CSIR-NET MSQ rule). No partial
// marks, no negative marking. Change this function alone if the rule changes.
function calculatePartCScore(){
  const rule = MARKING_RULES.C;
  const qs = getActiveQuestions().filter(q=>q.section==="C");
  let attempted=0, correct=0, wrong=0, score=0;
  qs.forEach(q=>{
    const ans = state.answers[q.id];
    if(!Array.isArray(ans) || ans.length===0) return;
    attempted++;
    const correctSet = q.correctAnswer.slice().sort().join(",");
    const givenSet = ans.slice().sort().join(",");
    if(givenSet === correctSet){ correct++; score += rule.correctMarks; }
    else { wrong++; score += 0; } // no negative marking in Part C
  });
  return {attempted, correct, wrong, score};
}

function calculateScore(){
  const a = calculatePartABScore("A");
  const b = calculatePartABScore("B");
  const c = calculatePartCScore();
  const totalScore = a.score + b.score + c.score;
  const totalAttempted = a.attempted + b.attempted + c.attempted;
  const totalCorrect = a.correct + b.correct + c.correct;
  const totalWrong = a.wrong + b.wrong + c.wrong;
  const totalUnattempted = getActiveQuestions().length - totalAttempted;
  const accuracy = totalAttempted>0 ? Math.round((totalCorrect/totalAttempted)*1000)/10 : 0;
  const timeUsedSec = TOTAL_DURATION_MIN*60 - state.remainingSeconds;

  return {
    mockNumber: state.mockNumber,
    mockTitle: state.mockTitle,
    submittedAt: Date.now(),
    sectionResults: { A:a, B:b, C:c },
    totalScore, totalAttempted, totalCorrect, totalWrong, totalUnattempted, accuracy,
    timeUsedSec,
    maxPossible: MARKING_RULES.A.maxAttempt*MARKING_RULES.A.correctMarks
               + MARKING_RULES.B.maxAttempt*MARKING_RULES.B.correctMarks
               + MARKING_RULES.C.maxAttempt*MARKING_RULES.C.correctMarks,
    answersSnapshot: JSON.parse(JSON.stringify(state.answers))
  };
}

/* ---------------------- 13. TOPIC PERFORMANCE -------------------------------- */
function computeTopicPerformance(){
  const qs = getActiveQuestions();
  const byTopic = {};
  qs.forEach(q=>{
    const ans = state.answers[q.id];
    if(ans === undefined || ans === null || (Array.isArray(ans) && ans.length===0) || ans==="") return; // only count attempted
    if(!byTopic[q.topic]) byTopic[q.topic] = {correct:0,total:0};
    byTopic[q.topic].total++;
    let isCorrect;
    if(q.section==="C"){
      const correctSet = q.correctAnswer.slice().sort().join(",");
      const givenSet = (Array.isArray(ans)?ans:[]).slice().sort().join(",");
      isCorrect = givenSet===correctSet;
    } else {
      isCorrect = ans===q.correctAnswer;
    }
    if(isCorrect) byTopic[q.topic].correct++;
  });
  return Object.keys(byTopic).map(topic=>({
    topic, pct: Math.round((byTopic[topic].correct/byTopic[topic].total)*100)
  })).sort((x,y)=> y.pct - x.pct);
}

/* ---------------------- 14. RESULT SCREEN ------------------------------------ */
function renderResult(result){
  const grid = document.getElementById("result-summary-grid");
  const timeUsed = `${String(Math.floor(result.timeUsedSec/3600)).padStart(2,"0")}:${String(Math.floor((result.timeUsedSec%3600)/60)).padStart(2,"0")}:${String(result.timeUsedSec%60).padStart(2,"0")}`;
  grid.innerHTML = `
    <div class="stat"><span>${result.totalScore}</span><label>Score / ${result.maxPossible}</label></div>
    <div class="stat"><span>${result.totalAttempted}</span><label>Attempted</label></div>
    <div class="stat"><span>${result.totalCorrect}</span><label>Correct</label></div>
    <div class="stat"><span>${result.totalWrong}</span><label>Incorrect</label></div>
    <div class="stat"><span>${result.totalUnattempted}</span><label>Unattempted</label></div>
    <div class="stat"><span>${result.accuracy}%</span><label>Accuracy</label></div>
    <div class="stat"><span>${timeUsed}</span><label>Time Used</label></div>
  `;

  const tbody = document.querySelector("#result-section-table tbody");
  const rows = [
    ["Part A", MARKING_RULES.A.available, MARKING_RULES.A.maxAttempt, result.sectionResults.A],
    ["Part B", MARKING_RULES.B.available, MARKING_RULES.B.maxAttempt, result.sectionResults.B],
    ["Part C", MARKING_RULES.C.available, MARKING_RULES.C.maxAttempt, result.sectionResults.C],
  ];
  let totalAvail=0,totalMax=0;
  tbody.innerHTML = rows.map(r=>{
    totalAvail+=r[1]; totalMax+=r[2];
    return `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3].attempted}</td><td>${r[3].correct}</td><td>${r[3].wrong}</td><td>${r[3].score.toFixed(2)}</td></tr>`;
  }).join("") + `<tr style="font-weight:700"><td>TOTAL</td><td>${totalAvail}</td><td>${totalMax}</td><td>${result.totalAttempted}</td><td>${result.totalCorrect}</td><td>${result.totalWrong}</td><td>${result.totalScore.toFixed(2)}</td></tr>`;

  const topicPerf = computeTopicPerformance();
  const topicWrap = document.getElementById("topic-performance");
  if(topicPerf.length===0){
    topicWrap.innerHTML = "<p>No questions were attempted, so topic performance cannot be computed.</p>";
  } else {
    topicWrap.innerHTML = topicPerf.map(t=>`
      <div class="topic-row">
        <span class="name">${t.topic}</span>
        <div class="topic-bar-track"><div class="topic-bar-fill" style="width:${t.pct}%"></div></div>
        <span class="pct">${t.pct}%</span>
      </div>
    `).join("");
  }
  const strong = topicPerf.filter(t=>t.pct>=75).map(t=>t.topic);
  const weak = topicPerf.filter(t=>t.pct<40).map(t=>t.topic);
  const revise = topicPerf.filter(t=>t.pct>=40 && t.pct<75).map(t=>t.topic);
  const fillList = (id, arr) => {
    document.getElementById(id).innerHTML = arr.length ? arr.map(t=>`<li>${t}</li>`).join("") : "<li>—</li>";
  };
  fillList("strong-topics", strong);
  fillList("weak-topics", weak);
  fillList("revise-topics", revise);
}

/* ---------------------- 15. REVIEW SCREEN ------------------------------------ */
function renderReview(){
  const qs = getActiveQuestions();
  const list = document.getElementById("review-list");
  list.innerHTML = qs.map((q, idx)=>{
    const ans = state.answers[q.id];
    const isMSQ = q.section==="C";
    let status, yourAnswerText;
    const attempted = isMSQ ? (Array.isArray(ans) && ans.length>0) : (ans!==undefined && ans!==null && ans!=="");

    if(!attempted){
      status = '<span class="r-status unattempted">— Unattempted</span>';
      yourAnswerText = "—";
    } else if(isMSQ){
      const correctSet = q.correctAnswer.slice().sort().join(",");
      const givenSet = ans.slice().sort().join(",");
      const ok = givenSet===correctSet;
      status = ok ? '<span class="r-status correct">✓ Correct</span>' : '<span class="r-status incorrect">✗ Incorrect</span>';
      yourAnswerText = ans.slice().sort().join(", ");
    } else {
      const ok = ans===q.correctAnswer;
      status = ok ? '<span class="r-status correct">✓ Correct</span>' : '<span class="r-status incorrect">✗ Incorrect</span>';
      yourAnswerText = ans;
    }
    const correctAnswerText = isMSQ ? q.correctAnswer.slice().sort().join(", ") : q.correctAnswer;

    return `
      <div class="review-item">
        <div class="r-meta">Q${idx+1} · ${q.section==="A"?"Part A":q.section==="B"?"Part B":"Part C"} · ${q.topic} · ${q.difficulty} ${status}</div>
        <div class="q-content-review">${q.question}</div>
        <div class="r-answer-line">Your Answer: <b>${yourAnswerText}</b></div>
        <div class="r-answer-line">Correct Answer: <b>${correctAnswerText}</b></div>
        <div class="r-explanation">${q.explanation}</div>
      </div>
    `;
  }).join("");

  if(window.MathJax && window.MathJax.typesetPromise){
    window.MathJax.typesetPromise([list]).catch(()=>{});
  }
}

/* ---------------------- 16. SCREEN SWITCHING ---------------------------------- */
function switchScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0,0);
}

/* ---------------------- 17. INIT ---------------------------------------------- */
function init(){
  renderDashboard();

  document.getElementById("btn-back-dashboard").addEventListener("click", ()=> switchScreen("screen-dashboard"));
  document.getElementById("btn-start-test").addEventListener("click", ()=>{
    const existing = loadState();
    if(existing && existing.mockNumber===pendingMock.mockNumber && !existing.testSubmitted){
      state = existing;
      resumeTest();
    } else {
      startTest(pendingMock);
    }
  });

  wireExamNav();

  document.getElementById("btn-review-answers").addEventListener("click", ()=>{ renderReview(); switchScreen("screen-review"); });
  document.getElementById("btn-back-result").addEventListener("click", ()=> switchScreen("screen-result"));
  document.getElementById("btn-retake").addEventListener("click", ()=>{
    const mock = getMockByNumber(state.mockNumber);
    clearState();
    startTest(mock);
  });
  document.getElementById("btn-dashboard-from-result").addEventListener("click", ()=>{
    switchScreen("screen-dashboard");
  });

  // Recover an in-progress (unsubmitted) test automatically on load
  const existing = loadState();
  if(existing && existing.testStarted && !existing.testSubmitted){
    state = existing;
    const mock = getMockByNumber(state.mockNumber);
    if(mock && mock.available){
      enterExamScreen();
    }
  } else if(existing && existing.testSubmitted && existing.lastResult){
    // Leave dashboard as-is; user can still see dashboard. (Result already saved to history.)
  }
}
