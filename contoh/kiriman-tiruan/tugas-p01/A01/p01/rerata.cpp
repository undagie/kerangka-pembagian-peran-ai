#include <iostream>
#include <iomanip>

int main() {
    int tugas = 80;
    int uts = 75;
    int uas = 90;
    int jumlah = tugas + uts + uas;
    double rerata = jumlah / 3.0;
    std::cout << "Jumlah    : " << jumlah << "\n";
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Rata-rata : " << rerata << "\n";
    return 0;
}
