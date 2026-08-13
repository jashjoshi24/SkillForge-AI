import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Trash2, Plus, Edit2, ShieldAlert, Sparkles, User, Briefcase, Code, GraduationCap, Copy, Check, MessageSquare } from 'lucide-react';

export const ExtractionReview = ({ onConfirm }) => {
  const { 
    extractedProfile, 
    updateExtractedSkill, 
    deleteExtractedSkill, 
    addExtractedSkill,
    targetRole,
    user
  } = useApp();

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Languages');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const candidateName = user?.name || 'Charmi Sonagra';
  const topSkillNames = extractedProfile.skills.slice(0, 4).map(s => s.name).join(', ');
  const generatedPitch = `Hi, I'm ${candidateName}. I specialize in ${topSkillNames || 'software development'} with expertise in building scalable architectures. Currently preparing for ${targetRole} opportunities with a technical match velocity of over 85%.`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(generatedPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleAddSkillSubmit = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    addExtractedSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: newSkillLevel,
      score: newSkillLevel === 'Advanced' ? 90 : (newSkillLevel === 'Intermediate' ? 75 : 50)
    });

    setNewSkillName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 font-mono text-xs">
      
      {/* Header Banner */}
      <div className="bg-[#16324F] p-4 rounded border border-[#C89B3C]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C89B3C] font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI SKILL EXTRACTION REVIEW FOR {candidateName.toUpperCase()}</span>
          </div>
          <p className="text-[#A9B4C0] text-xs mt-1 font-body">
            Review and correct AI-extracted technical profile details before running skill gap cartography.
          </p>
        </div>

        <button
          onClick={onConfirm}
          className="px-6 py-2.5 rounded bg-[#C89B3C] hover:bg-[#b08732] text-[#10243E] font-display font-bold text-xs tracking-wider flex items-center gap-2 shadow shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          CONFIRM & SURVEY SKILL GAPS
        </button>
      </div>

      {/* AI ELEVATOR PITCH GENERATOR BOX (FEATURE ADDITION) */}
      <div className="p-4 bg-[#10243E] rounded border border-[#6B9080]/50 space-y-3">
        <div className="flex items-center justify-between border-b border-[#EDEDE3]/10 pb-2">
          <div className="flex items-center gap-2 text-[#6B9080] font-bold text-xs">
            <MessageSquare className="w-4 h-4" />
            <span>AI RECRUITER ELEVATOR PITCH GENERATOR</span>
          </div>
          <button
            onClick={handleCopyPitch}
            className="px-3 py-1 rounded bg-[#16324F] hover:bg-[#6B9080]/20 border border-[#6B9080] text-[#6B9080] text-[10px] flex items-center gap-1.5"
          >
            {copiedPitch ? <Check className="w-3.5 h-3.5 text-[#6B9080]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPitch ? 'COPIED TO CLIPBOARD' : 'COPY PITCH'}</span>
          </button>
        </div>

        <p className="text-xs font-body text-[#EDEDE3] italic leading-relaxed bg-[#16324F] p-3 rounded border border-[#EDEDE3]/10">
          "{generatedPitch}"
        </p>
      </div>

      {/* SECTION 1: EXTRACTED SKILLS */}
      <div className="bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EDEDE3]/10 pb-3">
          <div className="flex items-center gap-2 text-[#EDEDE3] font-bold text-sm font-display">
            <Code className="w-4 h-4 text-[#C89B3C]" />
            <span>1. EXTRACTED TECHNICAL SKILLS ({extractedProfile.skills.length})</span>
          </div>
          <button
            onClick={() => setShowAddModal(!showAddModal)}
            className="px-2.5 py-1 rounded bg-[#10243E] text-[#C89B3C] border border-[#C89B3C]/40 hover:bg-[#C89B3C]/10 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            ADD SKILL
          </button>
        </div>

        {/* Add Skill Quick Form */}
        {showAddModal && (
          <form onSubmit={handleAddSkillSubmit} className="p-3 bg-[#10243E] rounded border border-[#C89B3C]/40 flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Skill Name (e.g. Docker, TypeScript)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="bg-[#16324F] text-[#EDEDE3] p-2 rounded border border-[#EDEDE3]/20 flex-1 min-w-[180px] focus:outline-none"
            />
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="bg-[#16324F] text-[#EDEDE3] p-2 rounded border border-[#EDEDE3]/20"
            >
              <option value="Languages">Languages</option>
              <option value="Frameworks">Frameworks</option>
              <option value="Databases">Databases</option>
              <option value="Tools">Tools</option>
              <option value="Architecture">Architecture</option>
            </select>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="bg-[#16324F] text-[#EDEDE3] p-2 rounded border border-[#EDEDE3]/20"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-[#6B9080] text-[#EDEDE3] font-bold rounded">
              SAVE
            </button>
          </form>
        )}

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {extractedProfile.skills.map((skill) => (
            <div key={skill.id} className="p-3 bg-[#10243E] rounded border border-[#EDEDE3]/12 flex items-center justify-between group hover:border-[#C89B3C]/40 transition-colors">
              <div>
                <div className="font-bold text-[#EDEDE3] text-xs flex items-center gap-2">
                  {skill.name}
                  <span className="text-[10px] text-[#A9B4C0] font-normal">({skill.category})</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    skill.proficiency === 'Advanced' 
                      ? 'bg-[#6B9080]/20 text-[#6B9080] border border-[#6B9080]' 
                      : 'bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]'
                  }`}>
                    {skill.proficiency.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-[#A9B4C0]">SCORE: {skill.score}%</span>
                </div>
              </div>

              <button
                onClick={() => deleteExtractedSkill(skill.id)}
                className="text-[#A9B4C0] hover:text-[#B5563C] p-1 rounded opacity-60 group-hover:opacity-100 transition-opacity"
                title="Remove extracted skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: EXPERIENCE */}
      <div className="bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-4">
        <div className="flex items-center gap-2 text-[#EDEDE3] font-bold text-sm font-display border-b border-[#EDEDE3]/10 pb-3">
          <Briefcase className="w-4 h-4 text-[#C89B3C]" />
          <span>2. WORK EXPERIENCE</span>
        </div>

        {extractedProfile.experience.map((exp) => (
          <div key={exp.id} className="p-4 bg-[#10243E] rounded border border-[#EDEDE3]/10 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <span className="font-bold text-[#EDEDE3]">{exp.role} · <span className="text-[#C89B3C]">{exp.company}</span></span>
              <span className="text-[#A9B4C0]">{exp.duration}</span>
            </div>
            <p className="text-xs font-body text-[#A9B4C0] leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* SECTION 3: PROJECTS */}
      <div className="bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-4">
        <div className="flex items-center gap-2 text-[#EDEDE3] font-bold text-sm font-display border-b border-[#EDEDE3]/10 pb-3">
          <Code className="w-4 h-4 text-[#C89B3C]" />
          <span>3. FEATURED PROJECTS</span>
        </div>

        {extractedProfile.projects.map((proj) => (
          <div key={proj.id} className="p-4 bg-[#10243E] rounded border border-[#EDEDE3]/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#EDEDE3]">{proj.title}</span>
              <span className="text-[#6B9080] font-mono text-[11px]">{proj.tech}</span>
            </div>
            <p className="text-xs font-body text-[#A9B4C0]">{proj.description}</p>
          </div>
        ))}
      </div>

      {/* SECTION 4: EDUCATION */}
      <div className="bg-[#16324F] p-5 rounded border border-[#EDEDE3]/15 space-y-4">
        <div className="flex items-center gap-2 text-[#EDEDE3] font-bold text-sm font-display border-b border-[#EDEDE3]/10 pb-3">
          <GraduationCap className="w-4 h-4 text-[#C89B3C]" />
          <span>4. EDUCATION</span>
        </div>

        {extractedProfile.education.map((edu) => (
          <div key={edu.id} className="p-3 bg-[#10243E] rounded border border-[#EDEDE3]/10 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#EDEDE3]">{edu.degree}</span>
              <span className="text-[#A9B4C0]"> — {edu.institution}</span>
            </div>
            <span className="text-[#C89B3C]">{edu.year}</span>
          </div>
        ))}
      </div>

      {/* Bottom Confirm Button */}
      <div className="pt-4 text-center">
        <button
          onClick={onConfirm}
          className="px-8 py-3 rounded bg-[#C89B3C] hover:bg-[#b08732] text-[#10243E] font-display font-bold text-sm tracking-wider inline-flex items-center gap-2 shadow-lg transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          CONFIRM PROFILE & MAP SKILL GAPS
        </button>
      </div>

    </div>
  );
};
