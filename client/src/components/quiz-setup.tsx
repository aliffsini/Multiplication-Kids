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
  const [questionCount, setQuestionCount] = useState<number>(10);
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
    if (!isNaN(num) && num >= 3 && num <= 100) {
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
      case 'special': return <span className="text-sm">⭐</span>;
    }
  };

  const getTableColors = (table: number) => {
    const colorSchemes = {
      2: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700', hover: 'hover:bg-red-200', selected: 'bg-red-200 border-red-500 ring-red-300' },
      3: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', hover: 'hover:bg-orange-200', selected: 'bg-orange-200 border-orange-500 ring-orange-300' },
      4: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700', hover: 'hover:bg-yellow-200', selected: 'bg-yellow-200 border-yellow-500 ring-yellow-300' },
      5: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700', hover: 'hover:bg-green-200', selected: 'bg-green-200 border-green-500 ring-green-300' },
      6: { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700', hover: 'hover:bg-teal-200', selected: 'bg-teal-200 border-teal-500 ring-teal-300' },
      7: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', hover: 'hover:bg-blue-200', selected: 'bg-blue-200 border-blue-500 ring-blue-300' },
      8: { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-700', hover: 'hover:bg-indigo-200', selected: 'bg-indigo-200 border-indigo-500 ring-indigo-300' },
      9: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700', hover: 'hover:bg-purple-200', selected: 'bg-purple-200 border-purple-500 ring-purple-300' },
      10: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-700', hover: 'hover:bg-pink-200', selected: 'bg-pink-200 border-pink-500 ring-pink-300' },
      11: { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700', hover: 'hover:bg-rose-200', selected: 'bg-rose-200 border-rose-500 ring-rose-300' },
      12: { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-700', hover: 'hover:bg-cyan-200', selected: 'bg-cyan-200 border-cyan-500 ring-cyan-300' }
    };
    return colorSchemes[table as keyof typeof colorSchemes] || colorSchemes[2];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            <Calculator className="inline h-10 w-10 text-brand-purple mr-3" />
            Multiplication for Kids - Times Tables Quiz
          </h1>
          <p className="text-lg text-slate-600">Interactive multiplication games to practice times tables and master math skills through fun learning!</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Times Tables Selection */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
            <Grid3X3 className="inline h-6 w-6 text-brand-cyan mr-2" />
            Select Multiplication Tables to Practice
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-4 mb-6">
            {availableTables.map(table => {
              const colors = getTableColors(table);
              return (
                <Card 
                  key={table}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-3 transform hover:scale-105 ${
                    selectedTables.includes(table) 
                      ? `${colors.selected} ring-4 shadow-xl scale-105` 
                      : `${colors.bg} ${colors.border} ${colors.hover} hover:shadow-lg`
                  }`}
                  onClick={() => toggleTable(table)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`text-3xl font-bold mb-2 ${colors.text}`}>{table}×</div>
                    <div className="text-sm text-slate-600">Times {table}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Difficulty Presets */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">
              <Bolt className="inline h-5 w-5 text-brand-amber mr-2" />
              Multiplication Difficulty Levels
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                    {key === 'extreme' ? 'All tables' : 
                     key === 'special' ? 'No easy numbers' : 
                     config.tables.join('×, ') + '×'}
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
              Quiz Length - Number of Multiplication Questions
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[5, 10, 15].map(count => (
                <Button
                  key={count}
                  variant={questionCount === count && !customCount.trim() ? "default" : "outline"}
                  className={`py-3 px-4 font-bold text-lg border-3 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${
                    questionCount === count && !customCount.trim()
                      ? "bg-purple-100 border-brand-purple ring-4 ring-purple-300 shadow-xl text-purple-900" 
                      : "border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-brand-purple"
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
                min="3"
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
              Math Quiz Timer Options
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
        <section className="text-center mb-10">
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
            Start Multiplication Quiz
          </Button>
          <p className="text-slate-600 mt-3">Get ready to show off your multiplication skills!</p>
        </section>

        {/* Educational Benefits Section */}
        <section className="mb-10">
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">
              Why Practice Multiplication for Kids?
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl mb-2">🧠</div>
                <h4 className="font-semibold text-slate-700 mb-2">Build Math Confidence</h4>
                <p className="text-sm text-slate-600">Regular practice helps children master times tables and feel confident with math skills.</p>
              </div>
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-semibold text-slate-700 mb-2">Improve Mental Math Speed</h4>
                <p className="text-sm text-slate-600">Quick multiplication recall is essential for advanced math concepts and everyday calculations.</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold text-slate-700 mb-2">Fun Learning Experience</h4>
                <p className="text-sm text-slate-600">Interactive games make multiplication practice enjoyable and engaging for young learners.</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer Content for SEO */}
        <footer className="mt-16 text-center">
          <Card className="p-6 bg-slate-50 border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Free Online Multiplication Practice</h4>
            <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our interactive multiplication quiz helps children learn times tables through engaging gameplay. 
              Perfect for elementary students looking to improve their math skills with customizable difficulty levels, 
              instant feedback, and progress tracking. Start practicing multiplication today!
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-slate-500">
              <span>times tables quiz</span>
              <span>•</span>
              <span>multiplication practice</span>
              <span>•</span>
              <span>math games for children</span>
              <span>•</span>
              <span>elementary math learning</span>
            </div>
          </Card>
        </footer>
      </main>
    </div>
  );
}
