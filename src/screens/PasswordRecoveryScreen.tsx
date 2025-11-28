import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Image } from 'react-native';

export default function PasswordRecoveryScreen() {
  const [studentId, setStudentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // 학번과 전화번호가 모두 입력되고, 로딩 상태가 아닐 때 버튼 활성화
  const canSubmit = studentId && phoneNumber.length >= 10 && !loading;

  const onRecoverPassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://10.0.2.2:8080/api/users/search-password', {
      userId: studentId,
      phoneNumber: phoneNumber,
    });

      // 서버 연결 준비 중이라서 일단 성공 알림만 띄움
      Alert.alert('비밀번호 찾기 성공', '비밀번호는 ' + response.data.data + ' 입니다.');
    } catch (error) {
      console.error(error);
      Alert.alert('비밀번호 찾기 실패', '서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.wrap}>
      {/* 상단 학교 로고 */}
      <View style={s.logoContainer}>
        <Image
          source={require('../images/hansung.png')}  // 이미지 소스 추가
          style={s.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={s.title}>비밀번호 찾기</Text>

      <View style={s.field}>
        <Text style={s.label}>학번</Text>
        <TextInput
          value={studentId}
          onChangeText={setStudentId}
          placeholder="2023123"
          keyboardType="numeric"
          style={s.input}
          editable={!loading}
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>전화번호</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="01012345678"
          keyboardType="phone-pad"
          style={s.input}
          editable={!loading}
        />
        <Text style={s.hint}>전화번호를 정확히 입력해 주세요.</Text>
      </View>

      <TouchableOpacity
        onPress={onRecoverPassword}
        disabled={!canSubmit}
        style={[s.primaryBtn, !canSubmit && { opacity: 0.5 }]}
      >
        {loading ? (<ActivityIndicator color="#fff" />) : (<Text style={s.primaryText}>비밀번호 찾기</Text>)}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 24,
    color: '#111',
    textAlign: 'center',
  },
  field: { marginBottom: 16 },
  label: { fontSize: 14, color: '#555', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  hint: { marginTop: 6, color: '#999', fontSize: 12 },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: '#2e6bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
