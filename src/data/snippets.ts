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
    id: 'js2',
    language: 'javascript',
    title: 'Promise Chain',
    difficulty: 'medium',
    code: `function fetchUserData(userId) {
  return fetch(\`/api/users/\${userId}\`)
    .then(response => {
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    })
    .then(userData => {
      return fetch(\`/api/posts?userId=\${userData.id}\`);
    })
    .then(response => response.json())
    .catch(error => console.error(error));
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
    id: 'ts2',
    language: 'typescript',
    title: 'Type Guards',
    difficulty: 'medium',
    code: `type User = {
  id: string;
  name: string;
  email: string;
};

type Admin = User & {
  role: 'admin';
  permissions: string[];
};

function isAdmin(user: User | Admin): user is Admin {
  return 'role' in user && user.role === 'admin';
}

function handleUser(user: User | Admin): void {
  if (isAdmin(user)) {
    console.log(\`Admin \${user.name} has permissions: \${user.permissions.join(', ')}\`);
  } else {
    console.log(\`Regular user: \${user.name}\`);
  }
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
    id: 'py2',
    language: 'python',
    title: 'Decorator Pattern',
    difficulty: 'medium',
    code: `import functools
import time

def timer_decorator(func):
    """
    A decorator that prints the execution time of a function
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        run_time = end_time - start_time
        print(f"Finished {func.__name__!r} in {run_time:.4f} seconds")
        return result
    return wrapper

@timer_decorator
def expensive_operation():
    """Simulates an expensive operation"""
    sum([i**2 for i in range(1000000)])
    return "Operation complete"`
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
    id: 'go2',
    language: 'go',
    title: 'Error Handling',
    difficulty: 'medium',
    code: `func processFile(path string) error {
  file, err := os.Open(path)
  if err != nil {
    return fmt.Errorf("failed to open file: %w", err)
  }
  defer file.Close()

  data, err := io.ReadAll(file)
  if err != nil {
    return fmt.Errorf("failed to read file: %w", err)
  }

  if len(data) == 0 {
    return errors.New("file is empty")
  }

  return processData(data)
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
    id: 'java2',
    language: 'java',
    title: 'Thread-Safe Singleton',
    difficulty: 'hard',
    code: `public class Singleton {
    private static volatile Singleton instance;
    private final String data;
    
    private Singleton(String data) {
        this.data = data;
    }
    
    public static Singleton getInstance(String data) {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton(data);
                }
            }
        }
        return instance;
    }
    
    public String getData() {
        return data;
    }
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
  {
    id: 'rb2',
    language: 'ruby',
    title: 'Module Mixin',
    difficulty: 'medium',
    code: `module Loggable
  def log(message)
    puts "[#{self.class.name}] #{Time.now}: #{message}"
  end
  
  def debug(message)
    log("DEBUG: #{message}") if ENV['DEBUG']
  end
  
  def info(message)
    log("INFO: #{message}")
  end
  
  def error(message)
    log("ERROR: #{message}")
  end
end

class ApiClient
  include Loggable
  
  def fetch_data
    info("Fetching data from API...")
    # API call logic here
    info("Data fetched successfully")
  rescue => e
    error("Failed to fetch data: #{e.message}")
  end
end`
  },
  {
    id: 'csharp1',
    language: 'csharp',
    title: 'LINQ Query',
    difficulty: 'medium',
    code: `public IEnumerable<Customer> GetPremiumCustomers(List<Customer> customers, decimal minimumSpending)
{
    return customers
        .Where(c => c.IsActive && c.TotalSpending > minimumSpending)
        .OrderByDescending(c => c.TotalSpending)
        .Select(c => new Customer
        {
            Id = c.Id,
            Name = c.Name,
            Email = c.Email,
            Status = "Premium"
        });
}`
  },
  {
    id: 'cpp1',
    language: 'cpp',
    title: 'Smart Pointers',
    difficulty: 'hard',
    code: `#include <memory>
#include <vector>
#include <iostream>

class Resource {
private:
    std::string name;
    
public:
    Resource(const std::string& n) : name(n) {
        std::cout << "Resource " << name << " acquired\\n";
    }
    
    void use() const {
        std::cout << "Using resource " << name << "\\n";
    }
    
    ~Resource() {
        std::cout << "Resource " << name << " released\\n";
    }
};

void process_resources() {
    std::vector<std::shared_ptr<Resource>> resources;
    
    resources.push_back(std::make_shared<Resource>("database"));
    resources.push_back(std::make_shared<Resource>("network"));
    
    auto file = std::make_unique<Resource>("file");
    file->use();
    
    for (const auto& res : resources) {
        res->use();
    }
}`
  },
  {
    id: 'php1',
    language: 'php',
    title: 'API Controller',
    difficulty: 'medium',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Validator;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);
        
        return response()->json($user, 201);
    }
}`
  },
  {
    id: 'rust1',
    language: 'rust',
    title: 'Error Handling',
    difficulty: 'medium',
    code: `use std::fs::File;
use std::io::{self, Read};
use std::path::Path;

fn read_file_contents(path: &Path) -> Result<String, io::Error> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn process_file(path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let path = Path::new(path);
    let contents = read_file_contents(path)?;
    
    if contents.is_empty() {
        return Err("File is empty".into());
    }
    
    println!("File contains {} characters", contents.len());
    Ok(())
}`
  },
  {
    id: 'sql1',
    language: 'sql',
    title: 'Complex Query',
    difficulty: 'medium',
    code: `SELECT 
  c.customer_id,
  c.name,
  c.email,
  COUNT(o.order_id) as total_orders,
  SUM(o.total_amount) as total_spent,
  AVG(o.total_amount) as average_order_value,
  MAX(o.order_date) as last_order_date
FROM 
  customers c
LEFT JOIN 
  orders o ON c.customer_id = o.customer_id
WHERE 
  o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)
  AND o.status = 'completed'
GROUP BY 
  c.customer_id, c.name, c.email
HAVING 
  COUNT(o.order_id) >= 3
ORDER BY 
  total_spent DESC
LIMIT 100;`
  },
  {
    id: 'html1',
    language: 'html',
    title: 'Responsive Form',
    difficulty: 'easy',
    code: `<form class="contact-form" action="/submit" method="post">
  <div class="form-group">
    <label for="name">Full Name</label>
    <input type="text" id="name" name="name" required placeholder="Enter your full name" />
  </div>
  
  <div class="form-group">
    <label for="email">Email Address</label>
    <input type="email" id="email" name="email" required placeholder="Enter your email address" />
  </div>
  
  <div class="form-group">
    <label for="subject">Subject</label>
    <select id="subject" name="subject">
      <option value="general">General Inquiry</option>
      <option value="support">Technical Support</option>
      <option value="billing">Billing Question</option>
      <option value="other">Other</option>
    </select>
  </div>
  
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="5" required placeholder="Type your message here..."></textarea>
  </div>
  
  <div class="form-actions">
    <button type="reset" class="btn-secondary">Clear</button>
    <button type="submit" class="btn-primary">Submit</button>
  </div>
</form>`
  },
  {
    id: 'css1',
    language: 'css',
    title: 'Flexbox Layout',
    difficulty: 'medium',
    code: `.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.card {
  flex: 0 0 calc(33.333% - 1rem);
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 16px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.875rem;
  color: #666666;
  line-height: 1.5;
}

@media (max-width: 992px) {
  .card {
    flex: 0 0 calc(50% - 1rem);
  }
}

@media (max-width: 576px) {
  .card {
    flex: 0 0 100%;
  }
}`
  },
];

export const getSnippetsByLanguage = (language: string): Snippet[] => {
  return snippets.filter(snippet => snippet.language === language);
};

export const getRandomSnippet = (language: string): Snippet | null => {
  const languageSnippets = getSnippetsByLanguage(language);

  // If no snippets are available for this language, return null instead of causing an error
  if (languageSnippets.length === 0) {
    console.warn(`No snippets available for language: ${language}`);
    // Try to return a snippet from JavaScript as fallback
    const fallbackSnippets = getSnippetsByLanguage('javascript');
    if (fallbackSnippets.length > 0) {
      return fallbackSnippets[0];
    }
    return null;
  }

  const randomIndex = Math.floor(Math.random() * languageSnippets.length);
  return languageSnippets[randomIndex];
};