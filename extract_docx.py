import docx
import sys

def extract_text(file_path):
    doc = docx.Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract.py <filename>")
        sys.exit(1)
    
    content = extract_text(sys.argv[1])
    with open('extracted_thesis.md', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Done")
