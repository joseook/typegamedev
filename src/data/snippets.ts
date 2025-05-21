import { Snippet } from '../types';

export const snippets: Snippet[] = [
  {
    id: 'js1',
    language: 'javascript',
    title: 'Array Filter Function',
    difficulty: 'easy',
    code: `function filterArray(array, callback) {
  const filteredArray = [];
  
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      filteredArray.push(array[i]);
    }
  }
  
  return filteredArray;
}`
  },
  {
    id: 'ts1',
    language: 'typescript',
    title: 'Generic Interface',
    difficulty: 'medium',
    code: `interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}`
  },
  {
    id: 'py1',
    language: 'python',
    title: 'List Comprehension',
    difficulty: 'easy',
    code: `def get_even_numbers(numbers):
    """
    Returns a list containing only the even numbers from the input list.
    
    Args:
        numbers: A list of integers
        
    Returns:
        A list of even integers
    """
    return [num for num in numbers if num % 2 == 0]`
  },
  {
    id: 'go1',
    language: 'go',
    title: 'Capability Check',
    difficulty: 'medium',
    code: `func IsCapabilityEnabled(c Capability) bool {
  enableMapMu.RLock()
  defer enableMapMu.RUnlock()
  if enabledMap == nil {
    return false
  }
  return enabledMap[c]
}`
  },
  {
    id: 'java1',
    language: 'java',
    title: 'Stream Processing',
    difficulty: 'medium',
    code: `public List<String> filterAndTransform(List<Integer> numbers) {
    return numbers.stream()
        .filter(n -> n % 2 == 0)
        .map(n -> n * 10)
        .map(String::valueOf)
        .collect(Collectors.toList());
}`
  },
  {
    id: 'rb1',
    language: 'ruby',
    title: 'Ruby Class',
    difficulty: 'easy',
    code: `class Person
  attr_accessor :name, :age
  
  def initialize(name, age)
    @name = name
    @age = age
  end
  
  def greeting
    "Hello, my name is #{@name} and I am #{@age} years old."
  end
end`
  },
];

export const getSnippetsByLanguage = (language: string): Snippet[] => {
  return snippets.filter(snippet => snippet.language === language);
};

export const getRandomSnippet = (language: string): Snippet => {
  const languageSnippets = getSnippetsByLanguage(language);
  const randomIndex = Math.floor(Math.random() * languageSnippets.length);
  return languageSnippets[randomIndex];
};