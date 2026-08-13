import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Code, Award, HelpCircle, ChevronDown, ChevronUp, ExternalLink, Sparkles, Target, Send, CheckCircle2, AlertTriangle, RefreshCw, X, Terminal, Copy, Check, FolderTree } from 'lucide-react';

export const Recommendations = () => {
  const { recommendations, targetRole, user } = useApp();
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'certifications', 'interview'
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  
  // Interactive AI Answer Evaluator State
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [isEvaluating, setIsEvaluating] = useState({});

  // Project Kickstart Blueprint Modal State
  const [selectedProject, setSelectedProject] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const toggleQuestionExpand = (qId) => {
    setExpandedQuestionId(prev => prev === qId ? null : qId);
  };

  const handleAnswerChange = (qId, text) => {
    setUserAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const evaluateAnswerWithAI = (question) => {
    const qId = question.id;
    const answerText = (userAnswers[qId] || '').trim();

    if (!answerText) return;

    setIsEvaluating(prev => ({ ...prev, [qId]: true }));

    setTimeout(() => {
      const textLower = answerText.toLowerCase();
      const expectedKeywords = question.answer.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      
      const foundKeywords = [];
      const missingKeywords = [];

      expectedKeywords.forEach(word => {
        const cleanWord = word.replace(/[^a-z]/g, '');
        if (cleanWord.length < 4) return;
        if (textLower.includes(cleanWord)) {
          if (!foundKeywords.includes(cleanWord)) foundKeywords.push(cleanWord);
        } else {
          if (!missingKeywords.includes(cleanWord)) missingKeywords.push(cleanWord);
        }
      });

      const keywordScore = Math.min(95, Math.max(55, Math.round((foundKeywords.length / (foundKeywords.length + missingKeywords.length || 1)) * 100) + 30));

      setEvaluations(prev => ({
        ...prev,
        [qId]: {
          score: keywordScore,
          found: foundKeywords.slice(0, 5),
          missing: missingKeywords.slice(0, 4),
          feedback: keywordScore >= 80 
            ? "Excellent technical articulation! You covered core architectural mechanisms with strong precision."
            : "Good foundational answer! Consider adding explicit technical terms and performance tradeoffs to reach senior-level depth."
        }
      }));

      setIsEvaluating(prev => ({ ...prev, [qId]: false }));
    }, 900);
  };

  const handleCopyBoilerplate = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Header Banner */}
      <div className="bg-[#16324F] p-5 rounded border border-[#C89B3C]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C89B3C] font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>AI RECOMMENDATIONS & PRACTICE ENGINE</span>
          </div>
          <p className="text-[#A9B4C0] text-xs font-body mt-1">
            Projects, certifications, and AI-evaluated interview studio matched to your gap analysis for <strong className="text-[#EDEDE3]">{targetRole}</strong>.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-[#10243E] p-1 rounded border border-[#EDEDE3]/15">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded font-mono text-xs flex items-center gap-1.5 transition-colors ${
              activeTab === 'projects' ? 'bg-[#16324F] text-[#C89B3C] border border-[#C89B3C]' : 'text-[#A9B4C0]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            PROJECTS ({recommendations.projects?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-3 py-1.5 rounded font-mono text-xs flex items-center gap-1.5 transition-colors ${
              activeTab === 'certifications' ? 'bg-[#16324F] text-[#C89B3C] border border-[#C89B3C]' : 'text-[#A9B4C0]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            CERTS ({recommendations.certifications?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3 py-1.5 rounded font-mono text-xs flex items-center gap-1.5 transition-colors ${
              activeTab === 'interview' ? 'bg-[#16324F] text-[#C89B3C] border border-[#C89B3C]' : 'text-[#A9B4C0]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            INTERVIEW Qs ({recommendations.interviewQuestions?.length || 0})
          </button>
        </div>
      </div>

      {/* TAB 1: AI PROJECT IDEAS */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.projects?.map((proj) => (
            <div key={proj.id} className="bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-3 hover:border-[#C89B3C]/50 transition-colors flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-display text-sm text-[#EDEDE3]">{proj.title}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C] font-bold">
                    {proj.difficulty}
                  </span>
                </div>

                <div className="p-2 rounded bg-[#10243E] border border-[#B5563C]/40 text-[#B5563C] text-[10px] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 shrink-0" />
                  <span>MATCHED GAP: {proj.matchedGap}</span>
                </div>

                <p className="text-xs font-body text-[#A9B4C0] leading-relaxed">{proj.description}</p>
              </div>

              <div className="pt-3 border-t border-[#EDEDE3]/10 flex items-center justify-between text-[10px]">
                <div className="flex flex-wrap gap-1">
                  {proj.skills.map(s => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-[#10243E] text-[#6B9080] border border-[#6B9080]/30">
                      {s}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => setSelectedProject(proj)}
                  className="px-3.5 py-1.5 rounded bg-[#C89B3C] text-[#10243E] font-bold hover:bg-[#b08732] shadow flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  BUILD THIS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CERTIFICATIONS DIRECTORY */}
      {activeTab === 'certifications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.certifications?.map((cert) => (
            <div key={cert.id} className="bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-3 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold font-display text-sm text-[#EDEDE3]">{cert.name}</div>
                <div className="text-xs text-[#C89B3C]">{cert.issuer}</div>
                <div className="flex items-center gap-2 pt-1 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-[#6B9080]/20 text-[#6B9080] border border-[#6B9080]">
                    {cert.level}
                  </span>
                  <span className="text-[#A9B4C0]">RELEVANCE: {cert.relevance}</span>
                </div>
              </div>

              <a
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-[#10243E] hover:bg-[#C89B3C]/20 border border-[#C89B3C] text-[#C89B3C] text-xs flex items-center gap-1.5 shrink-0"
              >
                <span>VERIFY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: INTERVIEW PRACTICE STUDIO */}
      {activeTab === 'interview' && (
        <div className="space-y-4">
          {recommendations.interviewQuestions?.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            const evalResult = evaluations[q.id];
            const loading = isEvaluating[q.id];

            return (
              <div key={q.id} className="bg-[#16324F] rounded border border-[#EDEDE3]/15 overflow-hidden transition-all">
                
                {/* Question Bar */}
                <div
                  onClick={() => toggleQuestionExpand(q.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none border-b border-[#EDEDE3]/10 hover:bg-[#10243E]/50"
                >
                  <div className="space-y-1 pr-4">
                    <div className="font-bold text-[#EDEDE3] text-xs font-body leading-relaxed flex items-center gap-2">
                      <span>{q.question}</span>
                      {evalResult && (
                        <span className="px-2 py-0.5 rounded bg-[#6B9080]/20 text-[#6B9080] border border-[#6B9080] text-[9px] font-mono">
                          EVALUATED: {evalResult.score}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-[#C89B3C]">TOPIC: {q.topic}</span>
                      <span className="text-[#A9B4C0]">·</span>
                      <span className="text-[#B5563C]">DIFFICULTY: {q.difficulty}</span>
                    </div>
                  </div>

                  {isExpanded ? <ChevronUp className="w-5 h-5 text-[#C89B3C]" /> : <ChevronDown className="w-5 h-5 text-[#A9B4C0]" />}
                </div>

                {/* Expanded Answer Studio */}
                {isExpanded && (
                  <div className="p-4 bg-[#10243E] space-y-4 border-t border-[#C89B3C]/40">
                    
                    {/* Reference Answer */}
                    <div className="space-y-1">
                      <div className="text-[10px] text-[#6B9080] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#6B9080]" />
                        MODEL BENCHMARK ANSWER:
                      </div>
                      <p className="text-xs font-body text-[#EDEDE3] leading-relaxed italic bg-[#16324F] p-3 rounded border border-[#EDEDE3]/10">
                        "{q.answer}"
                      </p>
                    </div>

                    {/* Interactive Practice Box */}
                    <div className="space-y-2 pt-2 border-t border-[#EDEDE3]/10">
                      <div className="text-[10px] text-[#C89B3C] font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>PRACTICE YOUR TECHNICAL ANSWER:</span>
                        <span className="text-[#A9B4C0] font-normal">AI CRITIQUE STUDIO</span>
                      </div>

                      <textarea
                        rows={3}
                        placeholder="Type your explanation here to evaluate technical keyword depth..."
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full bg-[#16324F] text-[#EDEDE3] font-body p-3 rounded border border-[#EDEDE3]/20 focus:border-[#C89B3C] focus:outline-none text-xs leading-relaxed"
                      />

                      <button
                        onClick={() => evaluateAnswerWithAI(q)}
                        disabled={loading || !(userAnswers[q.id] || '').trim()}
                        className={`px-4 py-2 rounded font-bold text-xs flex items-center gap-2 transition-all ${
                          loading || !(userAnswers[q.id] || '').trim()
                            ? 'bg-[#16324F] text-[#A9B4C0] border border-[#EDEDE3]/10 cursor-not-allowed'
                            : 'bg-[#C89B3C] hover:bg-[#b08732] text-[#10243E] shadow'
                        }`}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>ANALYZING TECHNICAL ACCURACY...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>EVALUATE ANSWER WITH AI</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* AI Evaluation Report Box */}
                    {evalResult && (
                      <div className="p-4 rounded bg-[#16324F] border border-[#6B9080]/50 space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-[#EDEDE3]/10 pb-2">
                          <span className="font-bold text-[#EDEDE3] flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#6B9080]" />
                            AI TELEMETRY EVALUATION REPORT
                          </span>
                          <span className="text-xl font-bold font-mono text-[#6B9080]">
                            {evalResult.score}% MATCH
                          </span>
                        </div>

                        <p className="text-xs font-body text-[#EDEDE3] leading-relaxed">
                          {evalResult.feedback}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-1">
                          <div className="p-2 rounded bg-[#10243E] border border-[#6B9080]/30 text-[#6B9080]">
                            <div className="font-bold mb-1 uppercase">DETECTED KEYWORDS:</div>
                            <div className="flex flex-wrap gap-1">
                              {evalResult.found.map(k => (
                                <span key={k} className="px-1.5 py-0.5 rounded bg-[#6B9080]/20 text-[#6B9080]">
                                  +{k}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-2 rounded bg-[#10243E] border border-[#B5563C]/30 text-[#B5563C]">
                            <div className="font-bold mb-1 uppercase">RECOMMENDED TO ADD:</div>
                            <div className="flex flex-wrap gap-1">
                              {evalResult.missing.map(k => (
                                <span key={k} className="px-1.5 py-0.5 rounded bg-[#B5563C]/20 text-[#B5563C]">
                                  -{k}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PROJECT KICKSTART ARCHITECTURE BLUEPRINT MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-[#10243E]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#16324F] border-2 border-[#C89B3C] rounded-md max-w-2xl w-full p-6 space-y-5 shadow-2xl relative font-mono text-xs text-[#EDEDE3] bg-blueprint-grid">
            
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-[#A9B4C0] hover:text-[#EDEDE3] p-1 rounded border border-[#EDEDE3]/15"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-[#EDEDE3]/15 pb-3">
              <div className="text-[10px] text-[#C89B3C] uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                PROJECT KICKSTART ARCHITECTURE BLUEPRINT
              </div>
              <h2 className="text-xl font-bold font-display text-[#EDEDE3] mt-1">
                {selectedProject.title}
              </h2>
              <div className="text-xs text-[#6B9080] mt-0.5">
                TARGET MATCHED GAP: {selectedProject.matchedGap}
              </div>
            </div>

            {/* Folder Structure */}
            <div className="p-3 bg-[#10243E] rounded border border-[#EDEDE3]/15 space-y-2">
              <div className="text-[10px] text-[#A9B4C0] uppercase flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-[#C89B3C]" />
                RECOMMENDED REPOSITORY LAYOUT:
              </div>
              <pre className="text-[11px] text-[#EDEDE3] font-mono leading-relaxed bg-[#16324F] p-2.5 rounded">
{`project-root/
├── app/
│   ├── api/          # Asynchronous Endpoint Routers
│   ├── core/         # Middleware & Rate Limiting
│   └── main.py       # FastAPI Engine
├── Dockerfile        # Container Spec
└── docker-compose.yml`}
              </pre>
            </div>

            {/* Starter Code Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#C89B3C] font-bold uppercase">STARTER BOILERPLATE SNIPPET (main.py):</span>
                <button
                  onClick={() => handleCopyBoilerplate(`from fastapi import FastAPI\nimport redis\n\napp = FastAPI()\nr = redis.Redis(host='localhost', port=6379, db=0)\n\n@app.get('/api/v1/resource')\ndef get_resource():\n    return {'status': 'success', 'rate_limit': 'active'}`)}
                  className="px-2.5 py-1 rounded bg-[#10243E] text-[#C89B3C] border border-[#C89B3C]/40 flex items-center gap-1 hover:bg-[#C89B3C]/10"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-[#6B9080]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'COPIED!' : 'COPY CODE'}</span>
                </button>
              </div>

              <pre className="p-3 rounded bg-[#10243E] border border-[#EDEDE3]/15 text-[11px] text-[#6B9080] font-mono overflow-x-auto">
{`from fastapi import FastAPI
import redis

app = FastAPI(title="${selectedProject.title}")
redis_client = redis.Redis(host='localhost', port=6379, db=0)

@app.get("/api/v1/health")
def health_check():
    return {"status": "online", "matched_gap": "${selectedProject.matchedGap}"}`}
              </pre>
            </div>

            {/* Footer Action */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 rounded bg-[#C89B3C] hover:bg-[#b08732] text-[#10243E] font-bold"
              >
                CLOSE BLUEPRINT
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
