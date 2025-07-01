import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Grid3X3, Bolt, ListOrdered, Clock, Play, TriangleAlert, Sprout, Flame, Gem, Crown } from 'lucide-react';
import { QuizSettings, DIFFICULTY_PRESETS, DifficultyPreset } from '@/types/quiz';

interface QuizSetupProps {
  onStartQuiz: (settings: QuizSettings) => void;
}

export function QuizSetup({ onStartQuiz }: QuizSetupProps) {
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [customCount, setCustomCount] = useState<string>('');
  const [timerEnabled, setTimerEnabled] = useState<boolean>(false);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(10);
  const [showValidation, setShowValidation] = useState<boolean>(false);

  const availableTables = Array.from({ length: 11 }, (_, i) => i + 2);

  const toggleTable = (table: number) => {
    setSelectedTables(prev => 
      prev.includes(table) 
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
    setShowValidation(false);
  };

  const selectDifficulty = (preset: DifficultyPreset) => {
    const config = DIFFICULTY_PRESETS[preset];
    setSelectedTables(config.tables);
    setShowValidation(false);
  };

  const handleQuestionCountChange = (count: number) => {
    setQuestionCount(count);
    setCustomCount('');
  };

  const handleCustomCountChange = (value: string) => {
    setCustomCount(value);
    const num = parseInt(value);
    if (num >= 5 && num <= 100) {
      setQuestionCount(num);
    }
  };

  const handleStartQuiz = () => {
    if (selectedTables.length === 0) {
      setShowValidation(true);
      return;
    }

    const settings: QuizSettings = {
      selectedTables,
      questionCount,
      timerEnabled,
      timePerQuestion
    };

    onStartQuiz(settings);
  };

  const getDifficultyIcon = (preset: DifficultyPreset) => {
    switch (preset) {
      case 'easy': return <Sprout className="h-4 w-4" />;
      case 'medium': return <Flame className="h-4 w-4" />;
      case 'hard': return <Gem className="h-4 w-4" />;
      case 'extreme': return <Crown className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            <Calculator className="inline h-10 w-10 text-brand-purple mr-3" />
            Multiplication Quiz
          </h1>
          <p className="text-lg text-slate-600">Practice your times tables and become a math champion!</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Times Tables Selection */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
            <Grid3X3 className="inline h-6 w-6 text-brand-cyan mr-2" />
            Choose Your Times Tables
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-4 mb-6">
            {availableTables.map(table => (
              <Card 
                key={table}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-3 ${
                  selectedTables.includes(table) 
                    ? 'border-brand-purple bg-purple-100 ring-4 ring-purple-300 shadow-xl transform scale-105' 
                    : 'border-slate-200 hover:border-brand-purple hover:bg-purple-25'
                }`}
                onClick={() => toggleTable(table)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-brand-purple mb-2">{table}×</div>
                  <div className="text-sm text-slate-600">Times {table}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Difficulty Presets */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">
              <Bolt className="inline h-5 w-5 text-brand-amber mr-2" />
              Quick Difficulty Presets
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(DIFFICULTY_PRESETS).map(([key, config]) => (
                <Button
                  key={key}
                  variant="outline"
                  className={`py-4 px-4 h-auto flex-col ${config.colorClass} border-2 border-current shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-semibold`}
                  onClick={() => selectDifficulty(key as DifficultyPreset)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getDifficultyIcon(key as DifficultyPreset)}
                    <span className="font-bold">{config.name}</span>
                  </div>
                  <div className="text-xs opacity-80 font-medium">
                    {key === 'extreme' ? 'All tables' : config.tables.join('×, ') + '×'}
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </section>

        {/* Quiz Settings */}
        <section className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Question Count */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              <ListOrdered className="inline h-5 w-5 text-brand-cyan mr-2" />
              Number of Questions
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[10, 20, 30].map(count => (
                <Button
                  key={count}
                  variant={questionCount === count && !customCount ? "default" : "outline"}
                  className={`py-3 px-4 font-bold text-lg border-3 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${
                    questionCount === count && !customCount 
                      ? "bg-brand-purple hover:bg-purple-700 text-black border-brand-purple ring-4 ring-purple-200" 
                      : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-brand-purple"
                  }`}
                  onClick={() => handleQuestionCountChange(count)}
                >
                  {count}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 font-medium">Custom:</label>
              <Input
                type="number"
                placeholder="Enter number"
                min="5"
                max="100"
                value={customCount}
                onChange={(e) => handleCustomCountChange(e.target.value)}
                className={`flex-1 font-bold text-lg ${
                  customCount && customCount.trim() 
                    ? 'border-2 border-brand-purple bg-purple-50 text-brand-purple ring-2 ring-purple-100' 
                    : 'border-slate-300'
                }`}
              />
            </div>
          </Card>

          {/* Timer Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              <Clock className="inline h-5 w-5 text-brand-amber mr-2" />
              Timer Settings
            </h3>
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={timerEnabled}
                  onCheckedChange={(checked) => setTimerEnabled(checked as boolean)}
                />
                <span className="text-slate-700 font-medium">Enable Timer</span>
              </label>
            </div>
            {timerEnabled ? (
              <div>
                <label className="block text-sm text-slate-600 mb-2">Time per question:</label>
                <Select value={timePerQuestion.toString()} onValueChange={(value) => setTimePerQuestion(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="20">20 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">
                Take your time! No time pressure.
              </div>
            )}
          </Card>
        </section>

        {/* Start Quiz */}
        <section className="text-center">
          {showValidation && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4 inline-flex items-center">
              <TriangleAlert className="h-5 w-5 mr-2" />
              Please select at least one times table to start the quiz!
            </div>
          )}
          <Button
            onClick={handleStartQuiz}
            className="bg-gradient-to-r from-purple-600 via-brand-purple to-brand-cyan text-white font-bold text-xl py-6 px-16 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-0"
            size="lg"
          >
            <Play className="h-7 w-7 mr-4" />
            Start Quiz Adventure!
          </Button>
          <p className="text-slate-600 mt-3">Get ready to show off your multiplication skills!</p>
        </section>
      </main>
    </div>
  );
}
